import { google, sheets_v4 } from "googleapis";
import { REGISTRATION_HEADERS } from "./registrationRows";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

const TEXT_COLUMN_INDEXES = [3, 20, 24, 32];

interface SheetConfig {
  email: string;
  privateKey: string;
  spreadsheetId: string;
  sheetName: string;
}

export function getSheetConfig(): SheetConfig {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  const sheetName = process.env.GOOGLE_SHEET_NAME;

  if (!email || !privateKey || !spreadsheetId || !sheetName) {
    throw new Error(
      "Missing Google Sheets configuration. Set GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SPREADSHEET_ID and GOOGLE_SHEET_NAME."
    );
  }

  return {
    email,
    privateKey: privateKey.replace(/\\n/g, "\n"),
    spreadsheetId,
    sheetName,
  };
}

function createClient(config: SheetConfig): sheets_v4.Sheets {
  const auth = new google.auth.JWT({
    email: config.email,
    key: config.privateKey,
    scopes: SCOPES,
  });
  return google.sheets({ version: "v4", auth });
}

function a1Range(sheetName: string, range: string): string {
  return `'${sheetName.replace(/'/g, "''")}'!${range}`;
}

async function getSheetId(
  client: sheets_v4.Sheets,
  config: SheetConfig
): Promise<number | undefined> {
  const meta = await client.spreadsheets.get({
    spreadsheetId: config.spreadsheetId,
    fields: "sheets.properties",
  });
  const sheet = meta.data.sheets?.find(
    (entry) => entry.properties?.title === config.sheetName
  );
  return sheet?.properties?.sheetId ?? undefined;
}

async function applyTextFormat(
  client: sheets_v4.Sheets,
  config: SheetConfig
): Promise<void> {
  const sheetId = await getSheetId(client, config);
  if (sheetId === undefined) return;

  await client.spreadsheets.batchUpdate({
    spreadsheetId: config.spreadsheetId,
    requestBody: {
      requests: TEXT_COLUMN_INDEXES.map((columnIndex) => ({
        repeatCell: {
          range: {
            sheetId,
            startColumnIndex: columnIndex,
            endColumnIndex: columnIndex + 1,
          },
          cell: { userEnteredFormat: { numberFormat: { type: "TEXT" } } },
          fields: "userEnteredFormat.numberFormat",
        },
      })),
    },
  });
}

async function ensureHeaderRow(
  client: sheets_v4.Sheets,
  config: SheetConfig
): Promise<void> {
  const headerRange = a1Range(config.sheetName, "A1:AG1");
  const existing = await client.spreadsheets.values.get({
    spreadsheetId: config.spreadsheetId,
    range: headerRange,
  });

  const firstRow = existing.data.values?.[0] ?? [];
  const hasHeader = firstRow.some((cell) => String(cell).trim() !== "");
  if (hasHeader) return;

  await client.spreadsheets.values.update({
    spreadsheetId: config.spreadsheetId,
    range: headerRange,
    valueInputOption: "RAW",
    requestBody: { values: [[...REGISTRATION_HEADERS]] },
  });

  await applyTextFormat(client, config);
}

export async function appendRegistrationRows(rows: string[][]): Promise<void> {
  const config = getSheetConfig();
  const client = createClient(config);

  await ensureHeaderRow(client, config);

  await client.spreadsheets.values.append({
    spreadsheetId: config.spreadsheetId,
    range: a1Range(config.sheetName, "A:AG"),
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: rows },
  });
}
