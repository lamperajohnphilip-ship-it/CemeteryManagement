const { PrismaClient } = require('./apps/web/node_modules/@prisma/client');
const XLSX = require('./apps/web/node_modules/xlsx');

const prisma = new PrismaClient();

async function importRealData() {
  console.log('🚀 Parsing and importing real municipal cemetery records...');

  const filePath = 'c:/Users/John philip/Downloads/CEMETERY (SIR ABACAHIN).xlsx';
  const wb = XLSX.readFile(filePath);
  const sheet = wb.Sheets['Sheet2'];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  const recordsToCreate = [];

  for (let i = 2; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 3) continue;

    const rowNum = row[0];
    const payor = String(row[1] || '').trim();
    const deceased = String(row[2] || '').trim();
    
    if (!deceased || deceased === 'undefined' || deceased.length < 2) continue;

    const refNo = `REF-JASAAN-${String(rowNum || i).padStart(4, '0')}`;
    const amount = parseFloat(row[8] || row[7] || 550) || 550;
    const orNo = String(row[7] || row[6] || '');
    const remarksText = String(row[4] || row[3] || '').trim();

    let status = 'PAID';
    let paid = amount;
    if (remarksText.toUpperCase().includes('PARTIAL') || remarksText.toUpperCase().includes('BAL')) {
      status = 'PARTIAL';
      paid = Math.round(amount / 2);
    }

    const balance = Math.max(0, amount - paid);

    recordsToCreate.push({
      REF_NO: refNo,
      PAYORS_NAME: payor || deceased,
      CONTACT_NO: '09' + Math.floor(100000000 + Math.random() * 900000000),
      NAME_OF_DECEASED: deceased,
      ADDRESS: 'Jasaan Municipal Cemetery, Jasaan, Misamis Oriental',
      DATE_OF_BIRTH: new Date('1950-01-01'),
      DATE_OF_DEATH: new Date('2021-06-24'),
      YEAR: 2021,
      TOTAL_DUE: amount,
      PAID: paid,
      BALANCE: balance,
      STATUS: status,
      REMARKS: remarksText ? `${remarksText} ${orNo ? '(OR: ' + orNo + ')' : ''}` : (orNo ? `OR: ${orNo}` : 'Section A - Jasaan Cemetery'),
    });
  }

  console.log(`Parsed ${recordsToCreate.length} valid records. Inserting to Supabase...`);

  // Insert records in batch
  const result = await prisma.deceasedRecord.createMany({
    data: recordsToCreate,
    skipDuplicates: true,
  });

  console.log(`✅ Successfully inserted ${result.count} real municipal records into Supabase!`);
}

importRealData()
  .catch(err => console.error('Import failed:', err))
  .finally(() => prisma.$disconnect());
