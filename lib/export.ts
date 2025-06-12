export function exportToTxt(data: any, filename: string) {
  const text = JSON.stringify(data, null, 2)
  const blob = new Blob([text], { type: "text/plain" })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()

  // Cleanup
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function formatCaseReport(caseData: any) {
  return `
CASE REPORT
-----------
Case: ${caseData.caseName}
Date: ${new Date(caseData.createdAt).toLocaleString()}

EVIDENCE DESCRIPTION
-------------------
${caseData.description}

DETECTED OBJECTS (${caseData.detectedObjects?.length || 0})
----------------
${caseData.detectedObjects?.join("\n- ") || "None detected"}
  `.trim()
}

