













export const mockOrders = [
{
  id: "ORD-1001",
  customer: "Sarah Mitchell",
  email: "sarah@example.com",
  items: [
  { productName: "Premium Linen Blazer", quantity: 1, price: 189 },
  { productName: "Silk-Blend Scarf", quantity: 2, price: 85 }],

  total: 359,
  status: "delivered",
  paymentStatus: "paid",
  date: "2026-03-28",
  trackingId: "TRK-98234"
},
{
  id: "ORD-1002",
  customer: "James Chen",
  email: "james@example.com",
  items: [{ productName: "Minimalist Chronograph", quantity: 1, price: 320 }],
  total: 320,
  status: "shipped",
  paymentStatus: "paid",
  date: "2026-03-29",
  trackingId: "TRK-98235"
},
{
  id: "ORD-1003",
  customer: "Emma Roberts",
  email: "emma@example.com",
  items: [
  { productName: "Artisan Leather Tote", quantity: 1, price: 245 },
  { productName: "Aviator Sunglasses", quantity: 1, price: 145 }],

  total: 390,
  status: "packed",
  paymentStatus: "paid",
  date: "2026-03-30"
},
{
  id: "ORD-1004",
  customer: "David Park",
  email: "david@example.com",
  items: [{ productName: "Italian Suede Loafers", quantity: 1, price: 210 }],
  total: 210,
  status: "pending",
  paymentStatus: "pending",
  date: "2026-03-30"
},
{
  id: "ORD-1005",
  customer: "Olivia Adams",
  email: "olivia@example.com",
  items: [
  { productName: "Cashmere Crew Sweater", quantity: 2, price: 165 },
  { productName: "Canvas Weekend Bag", quantity: 1, price: 175 }],

  total: 505,
  status: "out_for_delivery",
  paymentStatus: "paid",
  date: "2026-03-29",
  trackingId: "TRK-98236"
},
{
  id: "ORD-1006",
  customer: "Michael Torres",
  email: "michael@example.com",
  items: [{ productName: "Premium Linen Blazer", quantity: 1, price: 189 }],
  total: 189,
  status: "delivered",
  paymentStatus: "paid",
  date: "2026-03-27",
  trackingId: "TRK-98237"
}];


export const salesData = [
{ month: "Oct", revenue: 12400, orders: 48 },
{ month: "Nov", revenue: 18900, orders: 72 },
{ month: "Dec", revenue: 28500, orders: 110 },
{ month: "Jan", revenue: 16200, orders: 63 },
{ month: "Feb", revenue: 21800, orders: 85 },
{ month: "Mar", revenue: 24600, orders: 96 }];