import React from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Table } from 'lucide-react'; // Changed Spreadsheet to Table
import { useApp } from '../context/AppContext';

const DataExport = () => {
  const { expenses, categories } = useApp();

  const exportToJSON = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      expenses: expenses,
      categories: categories
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `accountable-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Type', 'Category', 'Amount'];
    const csvData = expenses.map(expense => {
      const category = categories.find(cat => cat.id === expense.categoryId);
      return [
        expense.date,
        `"${expense.description.replace(/"/g, '""')}"`,
        expense.type,
        category?.name || 'Unknown',
        expense.amount
      ];
    });

    const csvContent = [headers, ...csvData]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `accountable-expenses-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    // Simple PDF export using window.print() with custom styles
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Accountable Export</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px;
              color: #1A1A1A;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px;
              border-bottom: 2px solid #00D1FF;
              padding-bottom: 10px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 12px; 
              text-align: left;
            }
            th { 
              background-color: #2C3E50; 
              color: white;
            }
            .income { color: #39FF14; }
            .expense { color: #FF4500; }
            .summary { 
              margin-top: 30px;
              padding: 20px;
              background-color: #f8f9fa;
              border-radius: 8px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Accountable Financial Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Type</th>
                <th>Category</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${expenses.map(expense => {
                const category = categories.find(cat => cat.id === expense.categoryId);
                return `
                  <tr>
                    <td>${expense.date}</td>
                    <td>${expense.description}</td>
                    <td>${expense.type}</td>
                    <td>${category?.name || 'Unknown'}</td>
                    <td class="${expense.type}">${expense.type === 'income' ? '+' : '-'}$${expense.amount.toFixed(2)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
          
          <div class="summary">
            <h3>Summary</h3>
            <p>Total Expenses: $${expenses.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0).toFixed(2)}</p>
            <p>Total Income: $${expenses.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0).toFixed(2)}</p>
            <p>Net Balance: $${(expenses.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0) - expenses.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0)).toFixed(2)}</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-futuristic p-6"
    >
      <h2 className="heading-2 mb-4">Export Data</h2>
      <p className="body-text-light mb-6">Export your financial data for backup or analysis</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportToJSON}
          className="glass-button p-4 rounded-futuristic text-left hover:bg-[#34495E] transition-all group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#00D1FF] rounded-lg">
              <FileText className="w-6 h-6 text-[#1A1A1A]" />
            </div>
          </div>
          <h3 className="body-text font-semibold mb-1">JSON Export</h3>
          <p className="body-text-light text-sm">Full data backup with categories</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportToCSV}
          className="glass-button p-4 rounded-futuristic text-left hover:bg-[#34495E] transition-all group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#39FF14] rounded-lg">
              <Table className="w-6 h-6 text-[#1A1A1A]" /> {/* Changed to Table icon */}
            </div>
          </div>
          <h3 className="body-text font-semibold mb-1">CSV Export</h3>
          <p className="body-text-light text-sm">Spreadsheet-friendly format</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportToPDF}
          className="glass-button p-4 rounded-futuristic text-left hover:bg-[#34495E] transition-all group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#FF4500] rounded-lg">
              <Download className="w-6 h-6 text-[#1A1A1A]" />
            </div>
          </div>
          <h3 className="body-text font-semibold mb-1">PDF Report</h3>
          <p className="body-text-light text-sm">Printable financial report</p>
        </motion.button>
      </div>

      <div className="mt-6 p-4 bg-[#2C3E50] rounded-futuristic">
        <h3 className="body-text font-semibold mb-2">Export Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="body-text-light">Total Expenses:</span>
            <span className="body-text ml-2">${expenses.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0).toFixed(2)}</span>
          </div>
          <div>
            <span className="body-text-light">Total Income:</span>
            <span className="body-text ml-2">${expenses.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0).toFixed(2)}</span>
          </div>
          <div>
            <span className="body-text-light">Total Records:</span>
            <span className="body-text ml-2">{expenses.length}</span>
          </div>
          <div>
            <span className="body-text-light">Categories:</span>
            <span className="body-text ml-2">{categories.length}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DataExport;