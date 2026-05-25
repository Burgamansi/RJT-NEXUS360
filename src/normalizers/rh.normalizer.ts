import { parseNumeric, normalizeDate, trimString } from "../utils/normalization.js";

function parseMonthToPeriod(monthName: string, year: string = "2026"): string {
  const months: Record<string, string> = {
    janeiro: "01", jan: "01",
    fevereiro: "02", fev: "02",
    março: "03", marco: "03", mar: "03", març: "03",
    abril: "04", abr: "04",
    maio: "05", mai: "05",
    junho: "06", jun: "06",
    julho: "07", jul: "07",
    agosto: "08", ago: "08",
    setembro: "09", set: "09",
    outubro: "10", out: "10",
    novembro: "11", nov: "11",
    dezembro: "12", dez: "12"
  };
  const normalized = monthName.toLowerCase().trim();
  for (const [key, code] of Object.entries(months)) {
    if (normalized.includes(key)) {
      return `${year}-${code}`;
    }
  }
  return `${year}-01`;
}

export function normalizeRH(row: any) {
  if (row.__type === "rh_indicators") {
    const period = row.period || "2026-01";
    return {
      referenceDate: period + "-01",
      domain: "rh",
      type: "rh_indicators",
      data: {
        period,
        activeEmployees: Number(row.active_employees) || 0,
        workedHours: Number(row.worked_hours) || 0,
        admissions: Number(row.admissions) || 0,
        dismissals: Number(row.dismissals) || 0,
        turnover: Number(row.turnover) || 0,
        turnoverTarget: Number(row.turnover_target) || 0,
        justifiedAbsences: Number(row.justified_absences) || 0,
        unjustifiedAbsences: Number(row.unjustified_absences) || 0,
        delays: Number(row.delays) || 0
      }
    };
  }

  if (row.__type === "absences_certificates") {
    const period = row.month ? parseMonthToPeriod(row.month) : "2026-01";
    return {
      referenceDate: row.date || period + "-01",
      domain: "rh",
      type: "absences_certificates",
      data: {
        cid: row.cid || "N/A",
        month: row.month || "",
        days: Number(row.days) || 0,
        date: row.date || "",
        employeeName: row.employee_name || "Desconhecido"
      }
    };
  }

  if (row.__type === "turnover") {
    const period = row.month ? parseMonthToPeriod(row.month) : "2026-01";
    return {
      referenceDate: row.date || period + "-01",
      domain: "rh",
      type: "turnover",
      data: {
        month: row.month || "",
        movementType: row.movement_type || "admission",
        employeeName: row.employee_name || "Desconhecido",
        role: row.role || "N/A",
        date: row.date || "",
        company: row.company || "Principal",
        terminationReason: row.termination_reason || null
      }
    };
  }

  // Fallback default absenteeism
  const keys = Object.keys(row);
  const dateKey = keys.find(k => k.toLowerCase().includes("data") || k.toLowerCase().includes("periodo") || k.toLowerCase().includes("date"));
  const referenceDate = dateKey ? normalizeDate(row[dateKey]) : new Date().toISOString().split("T")[0];

  const employeeKey = keys.find(k => ["funcionario", "colaborador", "employee", "nome"].some(kw => k.toLowerCase().includes(kw)));
  const absenceTypeKey = keys.find(k => ["atestado", "falta", "ausencia", "tipo", "absence"].some(kw => k.toLowerCase().includes(kw)));
  const absenceDateKey = keys.find(k => ["data", "date"].some(kw => k.toLowerCase().includes(kw)) && k !== dateKey);
  const hoursLostKey = keys.find(k => ["horas", "hours"].some(kw => k.toLowerCase().includes(kw)));

  return {
    referenceDate,
    domain: "rh",
    type: "absenteeism",
    data: {
      employeeName: employeeKey ? trimString(row[employeeKey]) : null,
      absenceType: absenceTypeKey ? trimString(row[absenceTypeKey]) : null,
      absenceDate: absenceDateKey ? normalizeDate(row[absenceDateKey]) : referenceDate,
      hoursLost: hoursLostKey ? parseNumeric(row[hoursLostKey]) : null
    }
  };
}
