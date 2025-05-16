// Global variables for charts
let timeHistoryChartU, timeHistoryChartN, timeHistoryChartE;
let responseSpectrumChartU, responseSpectrumChartN, responseSpectrumChartE;

// Core function to process time history text (shared by file and demo)
function processText(text) {
    const lines = text.split('\n').filter(line => line.trim() !== '' && !line.startsWith('#'));
    const timeHistoryData = lines.map(line => {
        const values = line.split(/\s+/).filter(val => val.trim() !== '').map(Number);
        if (values.length >= 4) {
            return { 
                time: values[0], 
                u: values[1],    // Vertical acceleration 
                n: values[2],    // North-South acceleration
                e: values[3]     // East-West acceleration
            };
        }
        return null;
    }).filter(item => item !== null);

    plotTimeHistory(timeHistoryData);

    const responseSpectrumDataU_g = calculateResponseSpectrum(timeHistoryData, 'u');
    const responseSpectrumDataN_g = calculateResponseSpectrum(timeHistoryData, 'n');
    const responseSpectrumDataE_g = calculateResponseSpectrum(timeHistoryData, 'e');

    const toGal = data_g => data_g.map(d => ({ ...d, spectralAcceleration: d.spectralAcceleration * 981 / 1000 }));

    const responseSpectrumDataU = toGal(responseSpectrumDataU_g);
    const responseSpectrumDataN = toGal(responseSpectrumDataN_g);
    const responseSpectrumDataE = toGal(responseSpectrumDataE_g);

    plotResponseSpectrum(responseSpectrumDataU, 'U');
    plotResponseSpectrum(responseSpectrumDataN, 'N');
    plotResponseSpectrum(responseSpectrumDataE, 'E');

    enableDownload(responseSpectrumDataU, 'U');
    enableDownload(responseSpectrumDataN, 'N');
    enableDownload(responseSpectrumDataE, 'E');
}

// Function to process the uploaded file
function processFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select a file to upload.');
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        processText(e.target.result);
    };
    reader.readAsText(file);
}

// Demo Data Button: fetch cx921.txt and process as demo
document.addEventListener('DOMContentLoaded', function() {
    const demoBtn = document.getElementById('demoDataBtn');
    if (demoBtn) {
        demoBtn.addEventListener('click', function() {
            fetch('cx921.txt')
                .then(res => {
                    if (!res.ok) throw new Error('Failed to load demo data');
                    return res.text();
                })
                .then(text => {
                    processText(text);
                    // Optionally, visually indicate demo is loaded
                    demoBtn.textContent = 'Demo Data (已載入)';
                    setTimeout(() => { demoBtn.textContent = 'Demo Data'; }, 2000);
                })
                .catch(err => {
                    alert('載入 demo data 失敗: ' + err.message);
                });
        });
    }
});

// Function to plot time history data using Chart.js for all directions
function plotTimeHistory(data) {
    // Plot for U (Vertical)
    const ctxU = document.getElementById('timeHistoryChartU').getContext('2d');
    if (timeHistoryChartU) {
        timeHistoryChartU.destroy();
    }
    
    // Calculate min and max values for proper scaling
    const uValues = data.map(d => d.u);
    const uMin = Math.min(...uValues);
    const uMax = Math.max(...uValues);
    const uRange = Math.max(Math.abs(uMin), Math.abs(uMax));
    
    timeHistoryChartU = new Chart(ctxU, {
        type: 'line',
        data: {
            labels: data.map(d => d.time),
            datasets: [{
                label: 'Acceleration U (Vertical) (gal)',
                data: data.map(d => d.u),
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false,
                pointRadius: 0 // Hide individual points for better performance
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time (s)'
                    },
                    ticks: {
                        maxTicksLimit: 10 // Limit the number of ticks for readability
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Acceleration (gal)'
                    },
                    // Set min and max to ensure proper scaling and centered at zero
                    suggestedMin: -uRange * 1.1,
                    suggestedMax: uRange * 1.1,
                    beginAtZero: false
                }
            },
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            animation: {
                duration: 0 // Disable animation for better performance
            }
        }
    });

    // Plot for N (North-South)
    const ctxN = document.getElementById('timeHistoryChartN').getContext('2d');
    if (timeHistoryChartN) {
        timeHistoryChartN.destroy();
    }
    
    // Calculate min and max values for proper scaling
    const nValues = data.map(d => d.n);
    const nMin = Math.min(...nValues);
    const nMax = Math.max(...nValues);
    const nRange = Math.max(Math.abs(nMin), Math.abs(nMax));
    
    timeHistoryChartN = new Chart(ctxN, {
        type: 'line',
        data: {
            labels: data.map(d => d.time),
            datasets: [{
                label: 'Acceleration N (North-South) (gal)',
                data: data.map(d => d.n),
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                fill: false,
                pointRadius: 0 // Hide individual points for better performance
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time (s)'
                    },
                    ticks: {
                        maxTicksLimit: 10 // Limit the number of ticks for readability
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Acceleration (gal)'
                    },
                    // Set min and max to ensure proper scaling and centered at zero
                    suggestedMin: -nRange * 1.1,
                    suggestedMax: nRange * 1.1,
                    beginAtZero: false
                }
            },
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            animation: {
                duration: 0 // Disable animation for better performance
            }
        }
    });

    // Plot for E (East-West)
    const ctxE = document.getElementById('timeHistoryChartE').getContext('2d');
    if (timeHistoryChartE) {
        timeHistoryChartE.destroy();
    }
    
    // Calculate min and max values for proper scaling
    const eValues = data.map(d => d.e);
    const eMin = Math.min(...eValues);
    const eMax = Math.max(...eValues);
    const eRange = Math.max(Math.abs(eMin), Math.abs(eMax));
    
    timeHistoryChartE = new Chart(ctxE, {
        type: 'line',
        data: {
            labels: data.map(d => d.time),
            datasets: [{
                label: 'Acceleration E (East-West) (gal)',
                data: data.map(d => d.e),
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                fill: false,
                pointRadius: 0 // Hide individual points for better performance
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time (s)'
                    },
                    ticks: {
                        maxTicksLimit: 10 // Limit the number of ticks for readability
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Acceleration (gal)'
                    },
                    // Set min and max to ensure proper scaling and centered at zero
                    suggestedMin: -eRange * 1.1,
                    suggestedMax: eRange * 1.1,
                    beginAtZero: false
                }
            },
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            animation: {
                duration: 0 // Disable animation for better performance
            }
        }
    });
}

// Function to calculate response spectrum
function calculateResponseSpectrum(timeHistoryData, direction) {
    const dt = timeHistoryData[1].time - timeHistoryData[0].time;
    const T_pts = new Set();
    for (let T = 0.01; T <= 0.1; T += 0.01) T_pts.add(parseFloat(T.toFixed(2)));
    for (let T = 0.15; T <= 1.0; T += 0.05) T_pts.add(parseFloat(T.toFixed(2)));
    if (!T_pts.has(0.1)) T_pts.add(0.1);
    if (!T_pts.has(1.0)) T_pts.add(1.0);
    for (let T = 1.1; T <= 5.0; T += 0.1) T_pts.add(parseFloat(T.toFixed(1)));
    const periods = Array.from(T_pts).sort((a, b) => a - b);
    const dampingRatio = 0.05;
    const maxAccel = Math.max(...timeHistoryData.map(d => Math.abs(d[direction])));

    const responseSpectrum = periods.map(T => {
        let sa_g;
        if (T < dt && T < 0.02) {
            sa_g = maxAccel * (1 + T / 0.02);
        } else {
            const omega = 2 * Math.PI / T;
            let u_sdof = 0;
            let v_sdof = 0;
            let max_abs_accel_sdof_g = 0;
            for (let i = 0; i < timeHistoryData.length; i++) {
                const ag_curr_g = timeHistoryData[i][direction];
                const u_ddot_rel_g = -ag_curr_g - (2 * dampingRatio * omega * v_sdof) - (omega * omega * u_sdof);
                v_sdof += u_ddot_rel_g * dt;
                u_sdof += v_sdof * dt;
                const current_abs_accel_g = -(2 * dampingRatio * omega * v_sdof) - (omega * omega * u_sdof);
                if (Math.abs(current_abs_accel_g) > max_abs_accel_sdof_g) {
                    max_abs_accel_sdof_g = Math.abs(current_abs_accel_g);
                }
            }
            sa_g = max_abs_accel_sdof_g;
        }
        if (T < 0.05) sa_g = Math.max(sa_g, maxAccel);
        sa_g = Math.max(sa_g, 0.001);
        sa_g = isNaN(sa_g) || !isFinite(sa_g) ? 0.001 : sa_g;
        return { period: T, spectralAcceleration: sa_g };
    });
    return responseSpectrum;
}

// Function to plot response spectrum
function plotResponseSpectrum(data, direction) {
    const ctx = document.getElementById(`responseSpectrumChart${direction}`).getContext('2d');
    let chartInstance; 

    if (direction === 'U' && responseSpectrumChartU) {
        responseSpectrumChartU.destroy();
    } else if (direction === 'N' && responseSpectrumChartN) {
        responseSpectrumChartN.destroy();
    } else if (direction === 'E' && responseSpectrumChartE) {
        responseSpectrumChartE.destroy();
    }

    chartInstance = new Chart(ctx, getChartConfig(data, direction));

    if (direction === 'U') {
        responseSpectrumChartU = chartInstance;
    } else if (direction === 'N') {
        responseSpectrumChartN = chartInstance;
    } else if (direction === 'E') {
        responseSpectrumChartE = chartInstance;
    }
}

function getChartConfig(data, direction) {
    const colors = {
        'U': 'rgba(75, 192, 192, 1)',
        'N': 'rgba(54, 162, 235, 1)',
        'E': 'rgba(255, 99, 132, 1)'
    };
    const saValues = data.map(d => d.spectralAcceleration);
    const saMax = Math.max(...saValues);
    const yAxisMax = saMax > 0 ? saMax * 1.1 : 100; 

    return {
        type: 'line',
        data: {
            labels: data.map(d => d.period),
            datasets: [{
                label: `Spectral Acceleration ${direction} (gal)`,
                data: data.map(d => d.spectralAcceleration),
                borderColor: colors[direction],
                borderWidth: 1,
                fill: false,
                pointRadius: 0,
                tension: 0.1 
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'logarithmic',
                    title: {
                        display: true,
                        text: 'Period (s) - Log Scale'
                    },
                    min: 0.01,
                    max: 5.0,
                    ticks: {
                        callback: function(value, index, ticks) {
                            const preferredTicks = [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5];
                            for (const pt of preferredTicks) {
                                if (Math.abs(value - pt) < 0.00001 * pt) { 
                                   if (pt === 0.01 || pt === 0.02 || pt === 0.05) return pt.toFixed(2);
                                   if (pt === 0.1 || pt === 0.2 || pt === 0.5) return pt.toFixed(1);
                                   return pt.toFixed(0);
                                }
                            }
                            return null; 
                        },
                        autoSkip: true, 
                        maxRotation: 0,
                        minRotation: 0,
                        padding: 10,
                    },
                    grid: {
                        display: true, 
                        drawOnChartArea: true,
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Spectral Acceleration (gal)'
                    },
                    ticks: {
                        callback: function(value, index, values) {
                            if (Math.floor(value) === value) {
                                return value;
                            }
                            if (value > 1000 && (value % 1) < 0.01) return Math.round(value);
                            return value.toFixed(1); 
                        }
                    },
                    suggestedMin: 0,
                    suggestedMax: yAxisMax,
                    beginAtZero: true
                }
            },
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: false
                },
                legend: {
                    labels: {
                        boxWidth: 12
                    }
                }
            },
            animation: {
                duration: 0 
            }
        }
    };
}

// Function to enable download of response spectrum data
function enableDownload(data, direction) {
    const downloadLink = document.getElementById(`downloadLink${direction}`);
    const textContent = data.map(d => `${d.period.toFixed(4)}\t${d.spectralAcceleration.toFixed(4)}`).join('\n');
    const blob = new Blob([textContent], { type: 'text/plain' });
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.querySelector('button').disabled = false;
}
