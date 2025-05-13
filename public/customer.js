// ==== UTILS ====
const getLastNDates = (n) => {
  const dates = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

const formatDate = (dateStr) => {
  if (!dateStr || dateStr.trim() === '') return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
};

const truncateText = (text, maxLength = 20) => {
  if (text.length > maxLength) {
    return {
      truncated: text.substring(0, maxLength) + '...',
      full: text,
      showMore: true
    };
  }
  return { truncated: text, full: text, showMore: false };
};

// ==== EVENT HANDLERS ====
const logout = () => {
  localStorage.clear();
  window.location.href = '/';
};

document.addEventListener('click', (e) => {
  if (e.target?.id === 'logout-btn') {
    logout();
  }
});

const performSearch = () => {
  const searchField = document.getElementById('searchField').selectedIndex;
  const searchInput = document.getElementById('searchInput').value.trim();
  const status = document.getElementById('searchSelect').value;
  const payload = {};

  if (searchInput !== '') {
    payload.searchField = searchField;
    payload.searchInput = searchInput;
  }
  if (status && status !== 'Chọn trạng thái') {
    payload.status = status;
  }
  if (Object.keys(payload).length === 0) {
    alert('Vui lòng nhập từ khóa hoặc chọn trạng thái!');
    return;
  }

  localStorage.setItem('searchKeyword', searchInput);
  localStorage.setItem('searchField', searchField);
  localStorage.setItem('searchStatus', status);

  fetch('https://app.jackielino-dev.io.vn/indexphp.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then(res => res.json())
    .then(data => {
      allData = Array.isArray(data) ? data : [];
      currentPage = 1;
      displayData(allData, currentPage);
    })
    .catch(error => {
      console.error(error);
      alert('Đã xảy ra lỗi khi gửi yêu cầu: ' + error.message);
      allData = [];
      displayData(allData, currentPage);
    });
};

// ==== DISPLAY FUNCTIONS ====
let currentPage = 1;
const itemsPerPage = 5;
let allData = [];

const displayData = (data, page) => {
  const tbody = document.querySelector('#callLogTable tbody');
  tbody.innerHTML = '';
  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="13">Không có kết quả tìm kiếm</td></tr>';
    updatePagination(0);
    return;
  }

  const start = (page - 1) * itemsPerPage;
  const paginatedData = data.slice(start, start + itemsPerPage);

  paginatedData.forEach((item, index) => {
    const row = document.createElement('tr');
    const workExpData = truncateText(item.work_experience || '');
    const educationData = truncateText(item.education || '');
    const skillsData = truncateText(item.skills || '');
    const birthDate = formatDate(item.date_of_birth);
    const statusClass = item.status === 'đã hoàn thành' ? 'status-completed' : 'status-pending';
    const itemId = item.id || `item-${index}`;

    row.innerHTML = `
      <td><a href="cv.html?id=${itemId}" target="_blank" class="btn btn-link btn-sm"><i class="fas fa-file-pdf"></i></a></td>
      <td>${start + index + 1}</td>
      <td>${item.full_name || ''}</td>
      <td>${birthDate}</td>
      <td>${item.email || ''}</td>
      <td>${item.phone_number || ''}</td>
      <td>${workExpData.truncated}</td>
      <td>${educationData.truncated}</td>
      <td>${skillsData.truncated}</td>
      <td>${item.job_position || ''}</td>
      <td><span class="status-badge ${statusClass}">${item.status || ''}</span></td>
      <td><button class="btn btn-info btn-sm" onclick="window.open('cv_details.html?id=${itemId}', '_blank')"><i class="fas fa-info-circle"></i> Chi tiết</button></td>
      <td><button class="btn btn-success btn-sm" onclick="showInterviewModal('${itemId}', '${item.full_name || ''}')"><i class="far fa-calendar-plus"></i> Đặt lịch</button></td>
    `;
    tbody.appendChild(row);
  });

  updatePagination(data.length);
};

const updatePagination = (totalItems) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pagination = document.querySelector('.pagination');
  pagination.innerHTML = '';

  pagination.innerHTML += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}"><a class="page-link" href="#" id="prevPage">«</a></li>`;
  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `<li class="page-item ${currentPage === i ? 'active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
  }
  pagination.innerHTML += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}"><a class="page-link" href="#" id="nextPage">»</a></li>`;

  pagination.querySelectorAll('[data-page]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      currentPage = parseInt(link.dataset.page);
      displayData(allData, currentPage);
    });
  });

  document.getElementById('prevPage')?.addEventListener('click', e => {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      displayData(allData, currentPage);
    }
  });

  document.getElementById('nextPage')?.addEventListener('click', e => {
    e.preventDefault();
    if (currentPage < totalPages) {
      currentPage++;
      displayData(allData, currentPage);
    }
  });
};

// ==== MODALS ====
window.showInterviewModal = (id, name) => {
  if (document.getElementById(`interviewModal-${id}`)) return;
  const today = new Date().toISOString().split('T')[0];

  const modalHTML = `
    <div class="modal fade dynamic-modal" id="interviewModal-${id}" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Đặt lịch phỏng vấn cho ${name}</h5>
            <button type="button" class="btn-close" data-mdb-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="interviewForm-${id}">
              <div class="mb-3"><label class="form-label">Ngày</label><input type="date" class="form-control" required value="${today}" min="${today}"></div>
              <div class="mb-3"><label class="form-label">Giờ bắt đầu</label><input type="time" class="form-control" required></div>
              <div class="mb-3"><label class="form-label">Giờ kết thúc</label><input type="time" class="form-control" required></div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-mdb-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary" onclick="scheduleInterview('${id}')">Đặt lịch</button>
          </div>
        </div>
      </div>
    </div>`;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
  const modal = new mdb.Modal(document.getElementById(`interviewModal-${id}`));
  modal.show();

  document.getElementById(`interviewModal-${id}`).addEventListener('hidden.mdb.modal', function () {
    this.remove();
  });
};

window.scheduleInterview = async (id) => {
  const form = document.querySelector(`#interviewForm-${id}`);
  const [date, startTime, endTime] = [
    form.querySelector('input[type="date"]').value,
    form.querySelectorAll('input[type="time"]')[0].value,
    form.querySelectorAll('input[type="time"]')[1].value
  ];

  if (!date || !startTime || !endTime) {
    alert('Vui lòng nhập đầy đủ thông tin.');
    return;
  }

  const payload = {
    candidate_id: id,
    interview_date: date,
    start_time: startTime,
    end_time: endTime
  };

  try {
    const res = await fetch('https://n8n.jackielino-dev.io.vn/webhook/ffbaf803-d7d6-41b2-adff-6fc9d2e2e10f', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      mdb.Modal.getInstance(document.getElementById(`interviewModal-${id}`)).hide();
      alert('Đã đặt lịch phỏng vấn thành công!');
    } else {
      const err = await res.json();
      throw new Error(err.message || 'Lỗi không xác định');
    }
  } catch (err) {
    alert('Lỗi khi đặt lịch: ' + err.message);
  }
};

// ==== INIT ====
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('searchButton')?.addEventListener('click', e => {
    e.preventDefault();
    performSearch();
  });

  document.getElementById('searchInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.getElementById('searchButton').click();
    }
  });

  document.getElementById('searchSelect')?.addEventListener('change', performSearch);

  const savedKeyword = localStorage.getItem('searchKeyword');
  const savedField = localStorage.getItem('searchField');
  const savedStatus = localStorage.getItem('searchStatus');

  if (savedKeyword || savedStatus) {
    document.getElementById('searchInput').value = savedKeyword || '';
    document.getElementById('searchField').selectedIndex = savedField || 0;
    document.getElementById('searchSelect').value = savedStatus || 'Chọn trạng thái';
    performSearch();
  }
});
