document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('userChart').getContext('2d');
    const userChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [
                'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
                'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
            ],
            datasets: [
                {
                    label: 'Người dùng đăng ký',
                    data: [0, 15, 28, 20, 25],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 1,
                    fill: true,
                    tension: 0.3,
                    pointRadius: 2,
                    pointHoverRadius: 3
                },
                {
                    label: 'Số lượng CV',
                    data: [0, 10, 13, 17, 20],
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderWidth: 1,
                    fill: true,
                    tension: 0.3,
                    pointRadius: 2,
                    pointHoverRadius: 3
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Người dùng đăng ký và số lượng CV theo tháng',
                },
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Số lượng'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: '2025'
                    }
                }
            }
        }
    });
});
document.addEventListener('DOMContentLoaded', function () {
    const dates = getLastNDates(7);
    const userData = [30, 45, 50, 40, 60, 21, 0];
    const cvData = [20, 35, 38, 42, 55, 11, 0];

    const userDataset = dates.map((date, index) => ({ x: date, y: userData[index] }));
    const cvDataset = dates.map((date, index) => ({ x: date, y: cvData[index] }));

    const chart = new Chart(document.getElementById('dailyChart').getContext('2d'), {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'Người dùng đăng ký',
                    data: userDataset,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 1,
                    fill: true,
                    tension: 0.3,
                    pointRadius: 2,
                    pointHoverRadius: 3
                },
                {
                    label: 'Số lượng CV',
                    data: cvDataset,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderWidth: 1,
                    fill: true,
                    tension: 0.3,
                    pointRadius: 2,
                    pointHoverRadius: 3
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Dữ liệu người dùng và CV 5 ngày gần nhất'
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                        tooltipFormat: 'dd-MM-yyyy',
                        displayFormats: {
                            day: 'dd-MM-yyyy'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Ngày'
                    }
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});