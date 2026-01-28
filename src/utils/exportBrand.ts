import jsPDF from "jspdf";

type BrandRecord = Record<string, any>;

const safe = (v: unknown) => (Array.isArray(v) ? v.join(" | ") : v ?? "");

export function exportBrandAsCSV(brand: BrandRecord) {
  const row = {
    id: brand.id,
    name: brand.name,
    website: brand.website,
    business_type: brand.business_type,
    product_or_service: brand.product_or_service,
    business_description: brand.business_description,
    assumed_audience: safe(brand.assumed_audience),
    marketing_channels: safe(brand.marketing_channels),
    country: brand.country,
    region_or_city: brand.region_or_city,
    currency: brand.currency,
    color: brand.color,
    created_at: brand.created_at,
    updated_at: brand.updated_at,
  };

  const header = Object.keys(row).join(",");
  const values = Object.values(row)
    .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
    .join(",");

  const csv = `${header}\n${values}`;

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const date = new Date().toISOString().split("T")[0];
  const filename = `brand_${(brand.name || "brand").toString().replace(/\s+/g, "_")}_${brand.id}_${date}.csv`;

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportBrandAsPDF(brand: BrandRecord) {
  const doc = new jsPDF({ unit: "pt" });

  const titleFont = "Helvetica";
  const bodyFont = "Helvetica";

  const date = new Date().toISOString().split("T")[0];
  const filename = `brand_${(brand.name || "brand").toString().replace(/\s+/g, "_")}_${brand.id}_${date}.pdf`;

  doc.setFont(titleFont, "bold");
  doc.setFontSize(22);
  doc.text(brand.name || "Brand Profile", 40, 50);

  doc.setFont(bodyFont, "normal");
  doc.setFontSize(12);
  doc.setTextColor("#555");
  doc.text(`Brand Profile Report — ${date}`, 40, 70);

  doc.setDrawColor("#000");
  doc.setLineWidth(1);
  doc.line(40, 85, 550, 85);

  const addSection = (title: string, text: unknown, yStart: number) => {
    doc.setFont(titleFont, "bold");
    doc.setFontSize(16);
    doc.setTextColor("#000");
    doc.text(title, 40, yStart);

    doc.setFont(bodyFont);
    doc.setFontSize(12);
    doc.setTextColor("#444");

    if (Array.isArray(text)) {
      const bullets = text.map((i) => `• ${i}`);
      doc.text(bullets, 60, yStart + 20);
      return yStart + 20 + bullets.length * 18;
    } else {
      const lines = doc.splitTextToSize((text as string) || "—", 480);
      doc.text(lines, 40, yStart + 20);
      return yStart + 20 + lines.length * 16;
    }
  };

  let y = 120;

  y = addSection("Website", brand.website, y);
  y += 15;
  y = addSection("Business Type", brand.business_type, y);
  y += 15;
  y = addSection("Product or Service", brand.product_or_service, y);
  y += 15;
  y = addSection("Business Description", brand.business_description, y);
  y += 15;
  y = addSection("Assumed Audience", brand.assumed_audience, y);
  y += 15;
  y = addSection("Marketing Channels", brand.marketing_channels, y);
  y += 15;
  y = addSection("Country", brand.country, y);
  y += 15;
  y = addSection("Region / City", brand.region_or_city, y);
  y += 15;
  y = addSection("Currency", brand.currency, y);
  y += 15;
  y = addSection("Colour", brand.color, y);

  doc.save(filename);
}

export default {
  exportBrandAsPDF,
  exportBrandAsCSV,
};
