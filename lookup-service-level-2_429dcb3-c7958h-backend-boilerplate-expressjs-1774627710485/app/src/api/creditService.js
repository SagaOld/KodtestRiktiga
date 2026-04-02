const baseURL = "https://coding-test-api.alvalabs.io";

// fetch the credit data and aggregate it 
async function getCreditDetails(ssn) {
    validateSSN(ssn);
    const [personal, debt, income] = await Promise.all([
        fetch(`${baseURL}/api/credit-data/personal-details/${ssn}`),
        fetch(`${baseURL}/api/credit-data/debt/${ssn}`),
        fetch(`${baseURL}/api/credit-data/assessed-income/${ssn}`)
    ]) 
    if (!personal.ok || !debt.ok || !income.ok) { 
        return null;
    }
    const personalData = await personal.json();
    const debtData = await debt.json();
    const incomeData = await income.json();

    return {
        ...personalData,
        ...debtData,
        ...incomeData
    }

}

function validateSSN(ssn) {
    const ssnFormat = /^\d{3}-?\d{2}-?\d{4}$/;
    if(!ssnFormat.test(ssn)) {
        const error = new Error("Invalid ssn format");
        error.statusCode = 400;
        throw error;
     }
}

module.exports = { getCreditDetails }