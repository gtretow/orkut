import { SiteClient } from "datocms-client";

export default async function recebedorDeRequest(req, res) {
  if (req.method === "POST") {
    const TOKEN = "d206db72ff996e29661d209bd415b9";
    const client = new SiteClient(TOKEN);

    const registroCriado = await client.items.create({
      itemType: "968778",
      ...req.body,
      /*  title: "Anão vestido de palhaço mata 8",
      imageUrl:
        "https://scontent.fgru5-1.fna.fbcdn.net/v/t1.18169-9/545482_172021446260106_343113974_n.png?_nc_cat=108&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=p2ZI6mPxgV8AX9WqiH_&_nc_ht=scontent.fgru5-1.fna&oh=715f853772f6376bb9542a89a3fe1642&oe=60F5EBF1",
      creatorSlug: "gtretow", */
    });
    res.json({
      dados: "algum dado",
      registroCriado: registroCriado,
    });
    return;
  }
}
