
export interface SampleContent {
  id: string;
  title: string;
  category: 'academic' | 'business' | 'creative' | 'technical';
  content: string;
}

export const sampleContents: SampleContent[] = [
  {
    id: 'academic-1',
    title: 'Trí tuệ nhân tạo',
    category: 'academic',
    content: `Trí tuệ nhân tạo (AI) là trí thông minh được thể hiện bởi máy móc, không giống với trí thông minh tự nhiên của con người và động vật. Nghiên cứu AI được định nghĩa là lĩnh vực nghiên cứu của các tác nhân thông minh, là bất kỳ hệ thống nào nhận thức được môi trường của mình và thực hiện các hành động để tối đa hóa cơ hội đạt được mục tiêu của nó.`
  },
  {
    id: 'academic-2',
    title: 'Biến đổi khí hậu',
    category: 'academic',
    content: `Cuộc khủng hoảng khí hậu toàn cầu là một trong những thách thức lớn nhất mà nhân loại đang phải đối mặt ngày nay. Nhiệt độ tăng, các hiện tượng thời tiết cực đoan và mực nước biển dâng cao đều là hậu quả của biến đổi khí hậu do con người gây ra. Cần phải hành động ngay lập tức để giảm thiểu những tác động này và chuyển đổi sang một tương lai bền vững.`
  },
  {
    id: 'business-1',
    title: 'Chiến lược marketing',
    category: 'business',
    content: `Marketing số đã trở thành trụ cột trong chiến lược kinh doanh hiện đại. Bằng cách tận dụng các kênh kỹ thuật số như phương tiện truyền thông xã hội, marketing nội dung và tối ưu hóa công cụ tìm kiếm, các doanh nghiệp có thể tiếp cận đối tượng mục tiêu của họ với chi phí hiệu quả. Các chiến dịch thành công kết hợp phân tích dữ liệu với kể chuyện hấp dẫn để tạo ra nội dung có giá trị và thúc đẩy sự tương tác của khách hàng.`
  },
  {
    id: 'business-2',
    title: 'Lãnh đạo trong kinh doanh',
    category: 'business',
    content: `Lãnh đạo hiệu quả trong môi trường kinh doanh hiện đại đòi hỏi sự kết hợp giữa tầm nhìn chiến lược và sự nhanh nhẹn về vận hành. Các nhà lãnh đạo thành công không chỉ thiết lập các mục tiêu đầy tham vọng mà còn trao quyền cho nhóm của họ, thúc đẩy văn hóa đổi mới và thích ứng với các điều kiện thị trường thay đổi. Bằng cách ưu tiên phát triển và giao tiếp rõ ràng, lãnh đạo thúc đẩy sự gắn kết trong tổ chức và vị thế của họ để thành công lâu dài.`
  },
  {
    id: 'creative-1',
    title: 'Câu chuyện ngắn',
    category: 'creative',
    content: `Ánh nắng sớm mai rọi qua khe cửa sổ, đánh thức Ana khỏi giấc mơ sâu. Cô chớp mắt nhìn đồng hồ - 7 giờ sáng, quá sớm cho một ngày thứ Bảy. Nhưng hôm nay không phải là một ngày bình thường. Hôm nay đánh dấu năm năm kể từ khi cô chuyển đến thành phố, năm năm kể từ khi cô bắt đầu lại.`
  },
  {
    id: 'creative-2',
    title: 'Thơ',
    category: 'creative',
    content: `Giữa lòng thành phố nhộn nhịp\nTôi tìm thấy sự yên bình trong hỗn loạn\nTiếng còi xe và tiếng cười\nHòa vào một bản giao hưởng năng động.`
  },
  {
    id: 'technical-1',
    title: 'Điện toán lượng tử',
    category: 'technical',
    content: `Những tiến bộ gần đây trong lĩnh vực điện toán lượng tử đã cách mạng hóa lĩnh vực khoa học máy tính. Máy tính lượng tử tận dụng các hiện tượng cơ học lượng tử để thực hiện các phép tính với tốc độ không thể đạt được bằng máy tính cổ điển. Công nghệ này hứa hẹn giải quyết các vấn đề phức tạp trong mật mã học, khoa học vật liệu và khám phá thuốc.`
  },
  {
    id: 'technical-2',
    title: 'Phát triển web',
    category: 'technical',
    content: `Phát triển web hiện đại đã phát triển vượt xa HTML và CSS đơn giản. Các khung JavaScript như React và Vue đã cách mạng hóa cách xây dựng ứng dụng web, cho phép trải nghiệm động và phong phú. Kiến trúc dịch vụ vi mô, API RESTful và GraphQL đã thay đổi cách các ứng dụng giao tiếp. Với sự xuất hiện của WebAssembly và PWA, ranh giới giữa ứng dụng web và ứng dụng gốc ngày càng mờ nhạt.`
  }
];
