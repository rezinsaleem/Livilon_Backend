import { Response } from 'express';
import PDFDocument from 'pdfkit';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { Material } from '../models/material.model';

// ─── Overview tiles ──────────────────────────────────────
export const getOverview = async () => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalOrders,
    totalProducts,
    totalCategories,
    totalMaterials,
    salesAgg,
    todayAgg,
    monthAgg,
  ] = await Promise.all([
    Order.countDocuments(),
    Product.countDocuments(),
    Category.countDocuments(),
    Material.countDocuments(),
    Order.aggregate([
      { $group: { _id: null, totalSales: { $sum: '$soldPrice' } } },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: startOfDay } } },
      { $group: { _id: null, sales: { $sum: '$soldPrice' }, count: { $sum: 1 } } },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, sales: { $sum: '$soldPrice' }, count: { $sum: 1 } } },
    ]),
  ]);

  const totalSales = salesAgg[0]?.totalSales ?? 0;
  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  return {
    totals: {
      orders: totalOrders,
      sales: totalSales,
      products: totalProducts,
      categories: totalCategories,
      materials: totalMaterials,
      averageOrderValue,
    },
    today: {
      orders: todayAgg[0]?.count ?? 0,
      sales: todayAgg[0]?.sales ?? 0,
    },
    thisMonth: {
      orders: monthAgg[0]?.count ?? 0,
      sales: monthAgg[0]?.sales ?? 0,
    },
  };
};

// ─── Monthly sales (12-point series for a given year) ────
export const getMonthlySales = async (year?: number) => {
  const targetYear = year ?? new Date().getFullYear();
  const start = new Date(targetYear, 0, 1);
  const end = new Date(targetYear + 1, 0, 1);

  const agg = await Order.aggregate([
    { $match: { createdAt: { $gte: start, $lt: end } } },
    {
      $group: {
        _id: { $month: '$createdAt' },
        totalSales: { $sum: '$soldPrice' },
        orderCount: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const monthLabels = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  const data = Array.from({ length: 12 }, (_, i) => {
    const row = agg.find((r) => r._id === i + 1);
    return {
      month: i + 1,
      label: monthLabels[i],
      totalSales: row?.totalSales ?? 0,
      orderCount: row?.orderCount ?? 0,
    };
  });

  return { year: targetYear, data };
};

// ─── Yearly sales totals ─────────────────────────────────
export const getYearlySales = async () => {
  const agg = await Order.aggregate([
    {
      $group: {
        _id: { $year: '$createdAt' },
        totalSales: { $sum: '$soldPrice' },
        orderCount: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return agg.map((row) => ({
    year: row._id,
    totalSales: row.totalSales,
    orderCount: row.orderCount,
  }));
};

// ─── Top selling products ────────────────────────────────
export const getTopProducts = async (limit: number = 5) => {
  const agg = await Order.aggregate([
    {
      $group: {
        _id: '$productId',
        totalSales: { $sum: '$soldPrice' },
        orderCount: { $sum: 1 },
      },
    },
    { $sort: { totalSales: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
  ]);

  return agg.map((row) => ({
    productId: row._id,
    totalSales: row.totalSales,
    orderCount: row.orderCount,
    product: row.product ?? null,
  }));
};

// ─── Date-range query helper for reports ─────────────────
const getOrdersInRange = async (startDate: Date, endDate: Date) => {
  const inclusiveEnd = new Date(endDate);
  inclusiveEnd.setHours(23, 59, 59, 999);

  return Order.find({
    createdAt: { $gte: startDate, $lte: inclusiveEnd },
  })
    .populate('productId')
    .sort({ createdAt: 1 });
};

// ─── CSV escape helper ───────────────────────────────────
const csvEscape = (val: unknown): string => {
  const str = val === undefined || val === null ? '' : String(val);
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

// ─── CSV export ──────────────────────────────────────────
export const exportSalesCsv = async (
  res: Response,
  startDate: Date,
  endDate: Date
): Promise<void> => {
  const orders = await getOrdersInRange(startDate, endDate);

  const headers = [
    'Order ID',
    'Date',
    'Client Name',
    'Product Model No',
    'Product Name',
    'Category',
    'Sold Price',
  ];

  const lines: string[] = [headers.join(',')];
  let totalSales = 0;

  for (const order of orders) {
    const product = order.productId as unknown as
      | { modelNo?: string; name?: string; category?: { name?: string } }
      | null;
    const row = [
      order._id.toString(),
      order.createdAt.toISOString(),
      order.clientName ?? '',
      product?.modelNo ?? '',
      product?.name ?? '',
      product?.category?.name ?? '',
      order.soldPrice,
    ].map(csvEscape);
    lines.push(row.join(','));
    totalSales += order.soldPrice;
  }

  lines.push('');
  lines.push(`Total Orders,${orders.length}`);
  lines.push(`Total Sales,${totalSales}`);

  const fileName = `sales-report-${startDate.toISOString().slice(0, 10)}_to_${endDate
    .toISOString()
    .slice(0, 10)}.csv`;

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  res.send(lines.join('\r\n'));
};

// ─── PDF export ──────────────────────────────────────────
export const exportSalesPdf = async (
  res: Response,
  startDate: Date,
  endDate: Date
): Promise<void> => {
  const orders = await getOrdersInRange(startDate, endDate);

  const fileName = `sales-report-${startDate.toISOString().slice(0, 10)}_to_${endDate
    .toISOString()
    .slice(0, 10)}.pdf`;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

  const doc = new PDFDocument({ margin: 40, size: 'A4' });
  doc.pipe(res);

  // Header
  doc.fontSize(20).text('Livilon — Sales Report', { align: 'center' });
  doc.moveDown(0.5);
  doc
    .fontSize(11)
    .fillColor('#555')
    .text(
      `Period: ${startDate.toISOString().slice(0, 10)} to ${endDate
        .toISOString()
        .slice(0, 10)}`,
      { align: 'center' }
    )
    .fillColor('black');
  doc.moveDown();

  // Table layout
  const colWidths = [70, 95, 90, 100, 80, 75];
  const tableHeaders = ['Date', 'Client', 'Model No', 'Product', 'Category', 'Sold Price'];
  const drawRow = (cells: string[], bold = false) => {
    const startX = doc.page.margins.left;
    const y = doc.y;
    doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(10);
    cells.forEach((cell, i) => {
      const x = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
      doc.text(cell, x, y, { width: colWidths[i] });
    });
    doc.moveDown(0.4);
  };

  drawRow(tableHeaders, true);
  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(
      doc.page.margins.left + colWidths.reduce((a, b) => a + b, 0),
      doc.y
    )
    .stroke();
  doc.moveDown(0.2);

  let totalSales = 0;
  for (const order of orders) {
    if (doc.y > doc.page.height - 80) {
      doc.addPage();
      drawRow(tableHeaders, true);
    }
    const product = order.productId as unknown as
      | { modelNo?: string; name?: string; category?: { name?: string } }
      | null;
    drawRow([
      order.createdAt.toISOString().slice(0, 10),
      order.clientName ?? 'N/A',
      product?.modelNo ?? '-',
      product?.name ?? '-',
      product?.category?.name ?? '-',
      String(order.soldPrice),
    ]);
    totalSales += order.soldPrice;
  }

  doc.moveDown();
  doc.font('Helvetica-Bold').fontSize(11);
  doc.text(`Total Orders: ${orders.length}`, { align: 'right' });
  doc.text(`Total Sales: ${totalSales}`, { align: 'right' });

  doc.end();
};
