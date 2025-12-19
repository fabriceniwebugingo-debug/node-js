// seed.js
const pool = require("./db");

async function seed() {
  try {
    const mainNames = ["voice_sms", "internet"];
    for (let name of mainNames) {
      await pool.query(
        "INSERT INTO main_category (name) VALUES ($1) ON CONFLICT DO NOTHING",
        [name]
      );
    }

    const mains = await pool.query("SELECT * FROM main_category");

    const subsData = [
      { name: "tubitayeho", main: "voice_sms" },
      { name: "irekure", main: "voice_sms" },
      { name: "gwamon", main: "voice_sms" },
      { name: "izindi_pack", main: "voice_sms" },
      { name: "foleva", main: "internet" },
      { name: "iwacu", main: "internet" },
      { name: "pake_zo_mumahanga", main: "internet" },
    ];

    for (let sub of subsData) {
      const main_id = mains.rows.find((m) => m.name === sub.main).id;
      await pool.query(
        "INSERT INTO sub_category (name, main_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
        [sub.name, main_id]
      );
    }

    const subs = await pool.query("SELECT * FROM sub_category");
    const periodsLabels = ["day", "week", "month"];

    for (let sub of subs.rows) {
      for (let label of periodsLabels) {
        await pool.query(
          "INSERT INTO period (label, sub_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
          [label, sub.id]
        );
      }
    }

    const periods = await pool.query("SELECT * FROM period");

    for (let p of periods.rows) {
      await pool.query(
        `
        INSERT INTO quantity_price (quantity, price, period_id) VALUES
        (100, 100, $1),
        (200, 180, $1),
        (500, 400, $1)
        ON CONFLICT DO NOTHING
      `,
        [p.id]
      );
    }

    console.log("✅ Seed completed!");
    process.exit();
  } catch (err) {
    console.error(err);
  }
}

seed();
