fetch('/layout/header.html') 
  .then(response => {
      
    if (!response.ok) {
      throw new Error('Không thể tải header: ' + response.status);
    }
    return response.text();
  })
  .then(data => {
    document.getElementById('header-placeholder').innerHTML = data;
  })
  .catch(error => {
    console.error('Lỗi khi tải header:', error);
    document.getElementById('header-placeholder').innerHTML = "<p>Lỗi tải header. Vui lòng thử lại sau.</p>";
  });

// Nhúng footer
fetch('/layout/footer.html') // Đường dẫn tuyệt đối
  .then(response => {
      
    if (!response.ok) {
      throw new Error('Không thể tải footer: ' + response.status);
    }
    return response.text();
  })
  .then(data => {
    document.getElementById('footer-placeholder').innerHTML = data;
  })
  .catch(error => {
    console.error('Lỗi khi tải footer:', error);
    document.getElementById('footer-placeholder').innerHTML = "<p>Lỗi tải footer. Vui lòng thử lại sau.</p>";
  });

