export const generateBillingData = () => {
  return [
    {
      id: 1,
      company: 'A회사',
      usageDate: '2026-01',
      cost: '100,000원',
      details: '라돈 측정 비용 (10건)',
    },
    {
      id: 2,
      company: 'A회사',
      usageDate: '2026-02',
      cost: '150,000원',
      details: '라돈 측정 비용 (15건)',
    },
    {
      id: 3,
      company: 'B회사',
      usageDate: '2026-02',
      cost: '50,000원',
      details: '라돈 측정 비용 (5건)',
    },
    {
      id: 4,
      company: 'C회사',
      usageDate: '2026-03',
      cost: '200,000원',
      details: '라돈 측정 비용 (20건)',
    },
  ];
};
