export const CATS = ['Electronics', 'Textiles', 'Food & Beverage', 'Industrial', 'Furniture', 'Automotive']
export const LOCS = ['Dhaka', 'Chattogram', 'Rajshahi', 'Khulna', 'Sylhet', 'Barishal']

export const genAuction = (i) => ({
  id: `auc_${i}`,
  title: `Bulk Lot #${i} – ${CATS[i % CATS.length]}`,
  category: CATS[i % CATS.length],
  location: LOCS[i % LOCS.length],
  image: `https://picsum.photos/seed/lot${i}/640/360`,
  startPrice: 1000 + i * 25,
  bidIncrement: 50,
  reservePrice: 2000 + i * 30,
  endsAt: Date.now() + (i % 5 + 1) * 60 * 1000 + 20000,
  currentBid: 1000 + i * 25 + (i % 7) * 50,
  bidCount: 10 + (i % 9),
  seller: i % 2 === 0 ? 'AgroTrade Ltd' : 'Dhaka Surplus Co',
  grade: ['A','B','C'][i % 3],
  quantity: 1000 + (i % 8) * 250,
  unit: 'kg',
  status: 'live',
})

export const AUCTIONS = Array.from({ length: 14 }).map((_, i) => genAuction(i + 1))
