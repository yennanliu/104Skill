# 104.com.tw Search URL Templates

Pre-configured search URLs for different job hunting scenarios.

## Software Engineer (台北/新北, Remote OK)

```
https://www.104.com.tw/jobs/search/?area=6001001000,6001002000&jobsource=joblist_search&keyword=%20%20%20%20%E8%BB%9F%E9%AB%94%E5%B7%A5%E7%A8%8B%E5%B8%AB&order=15&remoteWork=1,2&page=1
```

**Filters:**
- Area: Taipei (6001001000), New Taipei (6001002000)
- Keyword: 軟體工程師 (Software Engineer)
- Remote work: Yes (1=full remote, 2=hybrid)
- Sort: Latest (order=15)

## Frontend Developer (全台灣)

```
https://www.104.com.tw/jobs/search/?keyword=Frontend%20Developer&jobsource=joblist_search&order=15&page=1
```

**Filters:**
- Keyword: Frontend Developer
- Area: All Taiwan
- Sort: Latest

## Backend Engineer (台北, 60K+)

```
https://www.104.com.tw/jobs/search/?area=6001001000&keyword=%E5%BE%8C%E7%AB%AF%E5%B7%A5%E7%A8%8B%E5%B8%AB&jobsource=joblist_search&order=15&scmin=3&page=1
```

**Filters:**
- Area: Taipei
- Keyword: 後端工程師 (Backend Engineer)
- Minimum salary: 60K+ (scmin=3)
- Sort: Latest

## Data Scientist (台北/新竹)

```
https://www.104.com.tw/jobs/search/?area=6001001000,6001008000&keyword=%E8%B3%87%E6%96%99%E7%A7%91%E5%AD%B8%E5%AE%B6&jobsource=joblist_search&order=15&page=1
```

**Filters:**
- Area: Taipei (6001001000), Hsinchu (6001008000)
- Keyword: 資料科學家 (Data Scientist)
- Sort: Latest

## Full Stack Developer (Remote Only)

```
https://www.104.com.tw/jobs/search/?keyword=Full%20Stack&remoteWork=1&jobsource=joblist_search&order=15&page=1
```

**Filters:**
- Keyword: Full Stack
- Remote work: Full remote only (remoteWork=1)
- Sort: Latest

## DevOps Engineer (新創公司)

```
https://www.104.com.tw/jobs/search/?keyword=DevOps&indcat=1001000000&jobsource=joblist_search&order=15&page=1
```

**Filters:**
- Keyword: DevOps
- Industry: Technology (indcat=1001000000)
- Sort: Latest

## Product Manager (科技業)

```
https://www.104.com.tw/jobs/search/?keyword=%E7%94%A2%E5%93%81%E7%B6%93%E7%90%86&indcat=1001000000&jobsource=joblist_search&order=15&page=1
```

**Filters:**
- Keyword: 產品經理 (Product Manager)
- Industry: Technology
- Sort: Latest

## UI/UX Designer (台北, 經驗不拘)

```
https://www.104.com.tw/jobs/search/?area=6001001000&keyword=UI%20UX%20Designer&jobexp=0&jobsource=joblist_search&order=15&page=1
```

**Filters:**
- Area: Taipei
- Keyword: UI UX Designer
- Experience: Any (jobexp=0)
- Sort: Latest

## Mobile App Developer (iOS/Android)

```
https://www.104.com.tw/jobs/search/?keyword=App%20%E9%96%8B%E7%99%BC&jobsource=joblist_search&order=15&page=1
```

**Filters:**
- Keyword: App 開發
- Sort: Latest

## Tech Lead / Engineering Manager

```
https://www.104.com.tw/jobs/search/?keyword=Tech%20Lead&jobsource=joblist_search&order=15&scmin=4&page=1
```

**Filters:**
- Keyword: Tech Lead
- Minimum salary: 80K+ (scmin=4)
- Sort: Latest

---

## URL Parameters Guide

### Common Parameters

| Parameter | Description | Example Values |
|-----------|-------------|----------------|
| `keyword` | Search keyword | `軟體工程師`, `Frontend`, `Backend` |
| `area` | Location code | `6001001000` (Taipei), `6001002000` (New Taipei) |
| `remoteWork` | Remote work option | `1` (full remote), `2` (hybrid), `3` (no remote) |
| `order` | Sort order | `15` (latest), `1` (relevance), `2` (salary high-low) |
| `scmin` | Minimum salary range | `1` (30-40K), `2` (40-50K), `3` (60-70K), `4` (80-90K), `5` (100K+) |
| `jobexp` | Experience required | `0` (any), `1` (1yr), `3` (3yrs), `5` (5yrs+) |
| `indcat` | Industry category | `1001000000` (tech), `2007000000` (finance) |
| `page` | Page number | `1`, `2`, `3`, ... |

### Area Codes (Taiwan Cities)

| City | Code |
|------|------|
| 台北市 (Taipei) | 6001001000 |
| 新北市 (New Taipei) | 6001002000 |
| 桃園市 (Taoyuan) | 6001005000 |
| 台中市 (Taichung) | 6001008000 |
| 台南市 (Tainan) | 6001014000 |
| 高雄市 (Kaohsiung) | 6001016000 |
| 新竹市 (Hsinchu) | 6001004000 |

### Salary Ranges

| scmin | Range |
|-------|-------|
| 1 | 30,000 - 40,000 |
| 2 | 40,000 - 50,000 |
| 3 | 60,000 - 70,000 |
| 4 | 80,000 - 90,000 |
| 5 | 100,000+ |

### Sort Orders

| order | Description |
|-------|-------------|
| 1 | Relevance |
| 2 | Salary (high to low) |
| 3 | Salary (low to high) |
| 15 | Latest postings |
| 11 | Company name (A-Z) |

## Building Your Own URL

1. Start at: `https://www.104.com.tw/jobs/search/`
2. Add your filters in the UI
3. Copy the resulting URL
4. Use it in automation:

```javascript
const SEARCH_URL = 'your-custom-url-here';

await page.goto(SEARCH_URL);
await autoApply104Jobs(page, { targetApplications: 20 });
```

## Tips

- **Test your URL first** - Open in browser to verify results
- **Start broad** - Use minimal filters first, then narrow down
- **Check job count** - Make sure you have enough jobs to meet target
- **Save favorites** - Keep URLs that work well for you
- **Update regularly** - Search criteria may change over time

## Example Workflows

### Daily Job Hunt
```javascript
// Morning: Check latest software engineer jobs in Taipei
const morningSearch = 'https://www.104.com.tw/jobs/search/?area=6001001000&keyword=軟體工程師&order=15&page=1';

await page.goto(morningSearch);
await autoApply104Jobs(page, { targetApplications: 10 });
```

### Weekend Batch
```javascript
// Weekend: Cast wider net, all Taiwan
const weekendSearch = 'https://www.104.com.tw/jobs/search/?keyword=Full%20Stack&remoteWork=1,2&order=15&page=1';

await page.goto(weekendSearch);
await autoApply104Jobs(page, { targetApplications: 50 });
```

### Targeted Search
```javascript
// Specific: Senior roles at tech companies
const targetedSearch = 'https://www.104.com.tw/jobs/search/?keyword=Senior%20Engineer&indcat=1001000000&scmin=4&order=15&page=1';

await page.goto(targetedSearch);
await autoApply104Jobs(page, { targetApplications: 20 });
```

---

**Need help building URLs?** Use 104's search interface, apply your filters, then copy the URL from your browser's address bar!
