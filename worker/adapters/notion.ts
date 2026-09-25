import type { Env, ProjectInquiryPayload } from "../types";

const NOTION_PAGES_ENDPOINT = "https://api.notion.com/v1/pages";
const NOTION_VERSION = "2025-09-03";

export type NotionProjectInquiryPage = {
  parent: {
    type: "data_source_id";
    data_source_id: string;
  };
  properties: Record<string, unknown>;
};

export function buildProjectInquiryPage(
  payload: ProjectInquiryPayload,
  dataSourceId: string,
): NotionProjectInquiryPage {
  const title = `${payload.company} — ${payload.firstName} ${payload.lastName}`.slice(0, 120);

  return {
    parent: {
      type: "data_source_id",
      data_source_id: dataSourceId,
    },
    properties: {
      Project: titleProperty(title),
      Name: textProperty(`${payload.firstName} ${payload.lastName}`),
      Email: { email: payload.email },
      Company: textProperty(payload.company),
      Website: { url: payload.website || null },
      Role: { select: { name: payload.role } },
      "Company Size": { select: { name: payload.companySize } },
      ...(payload.businessRevenue
        ? { "Business Revenue": { select: { name: payload.businessRevenue } } }
        : {}),
      Context: textProperty(payload.project),
      Source: { select: { name: payload.source } },
      Status: { select: { name: "New" } },
    },
  };
}

export async function createProjectInquiry(
  payload: ProjectInquiryPayload,
  env: Env,
  fetcher: typeof fetch = fetch,
) {
  const response = await fetcher(NOTION_PAGES_ENDPOINT, {
    method: "POST",
    headers: notionHeaders(env),
    body: JSON.stringify(
      buildProjectInquiryPage(payload, env.NOTION_PROJECT_INQUIRIES_DATA_SOURCE_ID),
    ),
  });

  if (!response.ok) {
    throw new Error("Notion inquiry write failed");
  }
}

function notionHeaders(env: Pick<Env, "NOTION_TOKEN">) {
  return {
    Authorization: `Bearer ${env.NOTION_TOKEN}`,
    "Content-Type": "application/json",
    "Notion-Version": NOTION_VERSION,
  };
}

function titleProperty(value: string) {
  return {
    title: [{ type: "text", text: { content: value } }],
  };
}

function textProperty(value: string) {
  return {
    rich_text: [{ type: "text", text: { content: value.slice(0, 2_000) } }],
  };
}
