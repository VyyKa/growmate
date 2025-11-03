export interface BlogPost {
  id: string
  title: string
  date: string
  author: string
  image: string
  category: "tips" | "news" | "technology" | "gardening"
  tags: string[]
  content: string
  excerpt: string
  readTime: string
}

export const blogData: BlogPost[] = [
  {
    id: "top-5-fruits-2025",
    title: "Top 5 loại trái cây ăn quả nổi bật năm 2025",
    date: "01 July 2025",
    author: "Hồ Khá",
    image: "/src/assets/imgs/homeBlog1.png",
    category: "news",
    tags: ["trái cây", "xu hướng", "2025", "nông sản"],
    readTime: "5 phút",
    excerpt: "Khám phá những loại trái cây đang được ưa chuộng nhất trong năm 2025, từ những giống mới đến các phương pháp trồng trọt hiện đại.",
    content: `
      <h2>Xu hướng trái cây năm 2025</h2>
      <p>Năm 2025 đánh dấu một bước ngoặt lớn trong ngành nông nghiệp Việt Nam với sự xuất hiện của nhiều giống trái cây mới và phương pháp canh tác tiên tiến.</p>
      
      <h3>1. Bưởi da xanh không hạt</h3>
      <p>Đây là giống bưởi được lai tạo đặc biệt, cho quả ngọt, mọng nước và hoàn toàn không có hạt. Giống này đang được các nhà vườn ưa chuộng vì giá trị thương mại cao.</p>
      
      <h3>2. Cam sành hữu cơ</h3>
      <p>Cam sành được trồng theo phương pháp hữu cơ, không sử dụng thuốc trừ sâu hóa học, cho vị ngọt tự nhiên và giàu vitamin C.</p>
      
      <h3>3. Xoài cát Hòa Lộc thế hệ mới</h3>
      <p>Giống xoài được cải tiến cho năng suất cao hơn 30% so với giống truyền thống, vẫn giữ được hương vị đặc trưng.</p>
      
      <h3>4. Ổi tím Malaysia</h3>
      <p>Giống ổi mới với màu tím đặc biệt, giàu anthocyanin - một chất chống oxy hóa mạnh, rất tốt cho sức khỏe.</p>
      
      <h3>5. Chanh dây vàng</h3>
      <p>Chanh dây vàng có vị ngọt hơn chanh dây tím, thích hợp để ăn trực tiếp hoặc làm nước ép.</p>
      
      <p>Những giống trái cây này không chỉ mang lại giá trị dinh dưỡng cao mà còn mở ra cơ hội kinh tế mới cho nông dân Việt Nam.</p>
    `
  },
  {
    id: "summer-fruit-care",
    title: "Làm thế nào để chăm sóc cây ăn quả trong mùa hè?",
    date: "05 July 2025",
    author: "Hồ Khá",
    image: "/src/assets/imgs/homeBlog2.png",
    category: "tips",
    tags: ["chăm sóc", "mùa hè", "cây ăn quả", "kỹ thuật"],
    readTime: "7 phút",
    excerpt: "Hướng dẫn chi tiết cách chăm sóc cây ăn quả trong mùa hè nắng nóng, đảm bảo cây phát triển khỏe mạnh và cho năng suất cao.",
    content: `
      <h2>Chăm sóc cây ăn quả mùa hè</h2>
      <p>Mùa hè với nhiệt độ cao và độ ẩm thấp là thời điểm khó khăn nhất đối với cây ăn quả. Dưới đây là những bí quyết giúp cây của bạn vượt qua mùa hè một cách khỏe mạnh.</p>
      
      <h3>1. Tưới nước đúng cách</h3>
      <p><strong>Thời gian tưới:</strong> Tưới vào sáng sớm (5-7h) hoặc chiều tối (17-19h) để tránh bốc hơi nước.</p>
      <p><strong>Lượng nước:</strong> Tăng lượng nước tưới 1.5-2 lần so với mùa mưa, đảm bảo đất luôn ẩm ướt.</p>
      <p><strong>Phương pháp:</strong> Tưới từ từ, tránh tưới trực tiếp vào thân cây.</p>
      
      <h3>2. Che chắn và tạo bóng mát</h3>
      <p>Sử dụng lưới che nắng 50-70% để bảo vệ cây khỏi ánh nắng gay gắt, đặc biệt là cây con và cây mới trồng.</p>
      
      <h3>3. Bón phân hợp lý</h3>
      <p><strong>Phân hữu cơ:</strong> Bón thêm phân chuồng hoai mục để cải thiện cấu trúc đất.</p>
      <p><strong>Phân NPK:</strong> Giảm lượng phân đạm, tăng kali để cây chống chịu tốt hơn.</p>
      
      <h3>4. Phòng trừ sâu bệnh</h3>
      <p>Mùa hè là thời điểm sâu bệnh phát triển mạnh. Cần thường xuyên kiểm tra và phun thuốc phòng trừ kịp thời.</p>
      
      <h3>5. Tỉa cành và tạo tán</h3>
      <p>Tỉa bỏ những cành khô, cành bị sâu bệnh để cây tập trung dinh dưỡng cho những cành khỏe mạnh.</p>
    `
  },
  {
    id: "growmate-journey",
    title: "Hành trình GrowMate: Kết nối nông dân và người tiêu dùng",
    date: "10 July 2025",
    author: "Hồ Khá",
    image: "/src/assets/imgs/homeBlog3.png",
    category: "news",
    tags: ["GrowMate", "nông nghiệp", "kết nối", "công nghệ"],
    readTime: "6 phút",
    excerpt: "Tìm hiểu về hành trình phát triển của GrowMate - nền tảng kết nối nông dân và người tiêu dùng trong lĩnh vực nông nghiệp.",
    content: `
      <h2>Hành trình GrowMate</h2>
      <p>GrowMate được thành lập với sứ mệnh tạo ra một cầu nối giữa những người nông dân chân chính và người tiêu dùng quan tâm đến nguồn gốc thực phẩm.</p>
      
      <h3>Khởi đầu</h3>
      <p>Ý tưởng về GrowMate xuất phát từ việc nhận thấy khoảng cách giữa nông dân và người tiêu dùng. Nhiều người muốn biết nguồn gốc thực phẩm họ ăn, nhưng không có cách nào để tiếp cận trực tiếp với nông dân.</p>
      
      <h3>Mô hình hoạt động</h3>
      <p><strong>Nhận nuôi cây trồng:</strong> Người tiêu dùng có thể "nhận nuôi" một cây trồng từ xa, theo dõi quá trình phát triển qua camera trực tiếp.</p>
      <p><strong>Minh bạch:</strong> Mọi thông tin về quy trình trồng trọt, chăm sóc đều được công khai.</p>
      <p><strong>Kết nối cảm xúc:</strong> Tạo ra mối liên kết đặc biệt giữa người tiêu dùng và thiên nhiên.</p>
      
      <h3>Thành tựu</h3>
      <p>Sau 2 năm hoạt động, GrowMate đã kết nối hơn 500 nông dân với hơn 10,000 người tiêu dùng, tạo ra một cộng đồng yêu thích nông nghiệp sạch.</p>
      
      <h3>Tương lai</h3>
      <p>GrowMate đang mở rộng sang các lĩnh vực khác như cung cấp nông cụ, vật tư nông nghiệp và phát triển các công nghệ hỗ trợ nông dân.</p>
    `
  },
  {
    id: "clean-agriculture-trends",
    title: "Xu hướng tiêu dùng nông sản sạch năm 2025",
    date: "15 July 2025",
    author: "Ngọc Minh",
    image: "/src/assets/imgs/homeBlog1.png",
    category: "news",
    tags: ["nông sản sạch", "xu hướng", "tiêu dùng", "2025"],
    readTime: "8 phút",
    excerpt: "Phân tích xu hướng tiêu dùng nông sản sạch trong năm 2025, những thay đổi trong hành vi mua sắm của người tiêu dùng.",
    content: `
      <h2>Xu hướng tiêu dùng nông sản sạch 2025</h2>
      <p>Năm 2025 chứng kiến sự thay đổi mạnh mẽ trong nhận thức và hành vi tiêu dùng của người dân Việt Nam đối với nông sản sạch.</p>
      
      <h3>1. Tăng trưởng thị trường</h3>
      <p>Thị trường nông sản sạch tại Việt Nam tăng trưởng 25% so với năm 2024, đạt giá trị 15.000 tỷ đồng.</p>
      
      <h3>2. Nhóm khách hàng mục tiêu</h3>
      <p><strong>Gia đình trẻ:</strong> Các cặp vợ chồng trẻ có thu nhập ổn định, quan tâm đến sức khỏe gia đình.</p>
      <p><strong>Người cao tuổi:</strong> Nhóm khách hàng có kinh nghiệm và sẵn sàng chi trả cao cho sản phẩm chất lượng.</p>
      
      <h3>3. Yếu tố quyết định mua hàng</h3>
      <p><strong>Nguồn gốc rõ ràng:</strong> 85% người tiêu dùng muốn biết nguồn gốc sản phẩm.</p>
      <p><strong>Chứng nhận hữu cơ:</strong> 70% ưu tiên sản phẩm có chứng nhận hữu cơ.</p>
      <p><strong>Giá cả hợp lý:</strong> 60% sẵn sàng trả thêm 20-30% cho sản phẩm sạch.</p>
      
      <h3>4. Kênh mua sắm</h3>
      <p><strong>Online:</strong> 45% người tiêu dùng mua nông sản sạch qua các nền tảng thương mại điện tử.</p>
      <p><strong>Trực tiếp từ nông dân:</strong> 35% thích mua trực tiếp từ nông dân hoặc các cửa hàng chuyên biệt.</p>
      
      <h3>5. Cơ hội cho nông dân</h3>
      <p>Xu hướng này mở ra nhiều cơ hội cho nông dân chuyển đổi sang mô hình canh tác sạch, tăng thu nhập và phát triển bền vững.</p>
    `
  },
  {
    id: "fruit-preservation-tips",
    title: "Bí quyết bảo quản trái cây tươi lâu tại nhà",
    date: "18 July 2025",
    author: "Thanh Hằng",
    image: "/src/assets/imgs/homeBlog2.png",
    category: "tips",
    tags: ["bảo quản", "trái cây", "mẹo vặt", "tươi lâu"],
    readTime: "6 phút",
    excerpt: "Những mẹo hay giúp bạn bảo quản trái cây tươi lâu hơn tại nhà, tiết kiệm chi phí và đảm bảo dinh dưỡng.",
    content: `
      <h2>Bảo quản trái cây tươi lâu</h2>
      <p>Việc bảo quản trái cây đúng cách không chỉ giúp kéo dài thời gian sử dụng mà còn giữ được hương vị và dinh dưỡng tối đa.</p>
      
      <h3>1. Phân loại trái cây</h3>
      <p><strong>Trái cây chín nhanh:</strong> Chuối, bơ, xoài - cần bảo quản riêng biệt.</p>
      <p><strong>Trái cây chín chậm:</strong> Táo, lê, cam - có thể bảo quản chung.</p>
      
      <h3>2. Nhiệt độ bảo quản</h3>
      <p><strong>Tủ lạnh (2-4°C):</strong> Táo, lê, nho, dâu tây.</p>
      <p><strong>Nhiệt độ phòng:</strong> Chuối, bơ, xoài, đu đủ.</p>
      
      <h3>3. Cách bảo quản từng loại</h3>
      <p><strong>Chuối:</strong> Bọc cuống bằng màng bọc thực phẩm để chậm chín.</p>
      <p><strong>Bơ:</strong> Để chín ở nhiệt độ phòng, sau đó cho vào tủ lạnh.</p>
      <p><strong>Táo:</strong> Bọc từng quả bằng giấy báo, để trong ngăn mát.</p>
      
      <h3>4. Mẹo chống thối</h3>
      <p><strong>Giấm trắng:</strong> Ngâm trái cây trong dung dịch giấm loãng (1:3) trong 2-3 phút.</p>
      <p><strong>Muối:</strong> Rửa trái cây bằng nước muối loãng để diệt vi khuẩn.</p>
      
      <h3>5. Dấu hiệu cần loại bỏ</h3>
      <p>Khi trái cây có dấu hiệu mềm nhũn, có mùi lạ, hoặc xuất hiện nấm mốc, cần loại bỏ ngay để tránh lây lan.</p>
    `
  },
  {
    id: "technology-in-agriculture",
    title: "Vai trò của công nghệ trong nông nghiệp hiện đại",
    date: "20 July 2025",
    author: "Hữu Phước",
    image: "/src/assets/imgs/homeBlog3.png",
    category: "technology",
    tags: ["công nghệ", "nông nghiệp", "IoT", "AI", "hiện đại"],
    readTime: "10 phút",
    excerpt: "Khám phá những ứng dụng công nghệ tiên tiến đang thay đổi ngành nông nghiệp, từ IoT đến AI và blockchain.",
    content: `
      <h2>Công nghệ trong nông nghiệp hiện đại</h2>
      <p>Công nghệ đang cách mạng hóa ngành nông nghiệp, giúp tăng năng suất, giảm chi phí và bảo vệ môi trường.</p>
      
      <h3>1. Internet of Things (IoT)</h3>
      <p><strong>Cảm biến thông minh:</strong> Theo dõi độ ẩm đất, nhiệt độ, ánh sáng trong thời gian thực.</p>
      <p><strong>Hệ thống tưới tự động:</strong> Tưới nước dựa trên dữ liệu cảm biến, tiết kiệm 30% lượng nước.</p>
      
      <h3>2. Trí tuệ nhân tạo (AI)</h3>
      <p><strong>Phân tích dữ liệu:</strong> AI giúp dự đoán thời tiết, sâu bệnh và năng suất cây trồng.</p>
      <p><strong>Nhận diện sâu bệnh:</strong> Ứng dụng AI có thể nhận diện sâu bệnh qua hình ảnh với độ chính xác 95%.</p>
      
      <h3>3. Blockchain</h3>
      <p><strong>Truy xuất nguồn gốc:</strong> Ghi lại toàn bộ quy trình từ gieo trồng đến thu hoạch.</p>
      <p><strong>Minh bạch:</strong> Người tiêu dùng có thể truy xuất nguồn gốc sản phẩm một cách chính xác.</p>
      
      <h3>4. Drone và Robot</h3>
      <p><strong>Drone phun thuốc:</strong> Phun thuốc trừ sâu chính xác, giảm 90% lượng thuốc sử dụng.</p>
      <p><strong>Robot thu hoạch:</strong> Tự động thu hoạch trái cây, giảm chi phí nhân công.</p>
      
      <h3>5. Tương lai của nông nghiệp</h3>
      <p>Với sự phát triển của công nghệ, nông nghiệp sẽ trở nên thông minh hơn, bền vững hơn và hiệu quả hơn.</p>
    `
  },
  {
    id: "organic-gardening-basics",
    title: "Làm vườn hữu cơ: Hướng dẫn cơ bản cho người mới bắt đầu",
    date: "22 July 2025",
    author: "Minh Tuấn",
    image: "/src/assets/imgs/homeBlog1.png",
    category: "gardening",
    tags: ["làm vườn", "hữu cơ", "cơ bản", "hướng dẫn"],
    readTime: "12 phút",
    excerpt: "Hướng dẫn chi tiết cách bắt đầu làm vườn hữu cơ tại nhà, từ chuẩn bị đất đến chăm sóc cây trồng.",
    content: `
      <h2>Làm vườn hữu cơ cơ bản</h2>
      <p>Làm vườn hữu cơ không chỉ mang lại thực phẩm sạch mà còn góp phần bảo vệ môi trường và sức khỏe gia đình.</p>
      
      <h3>1. Chuẩn bị đất</h3>
      <p><strong>Kiểm tra độ pH:</strong> Đất hữu cơ tốt có độ pH từ 6.0-7.0.</p>
      <p><strong>Cải thiện cấu trúc:</strong> Thêm phân hữu cơ, rơm rạ để tăng độ tơi xốp.</p>
      <p><strong>Loại bỏ cỏ dại:</strong> Nhổ cỏ bằng tay, tránh sử dụng thuốc diệt cỏ.</p>
      
      <h3>2. Chọn giống cây</h3>
      <p><strong>Cây dễ trồng:</strong> Rau xanh, cà chua, ớt, dưa chuột.</p>
      <p><strong>Giống địa phương:</strong> Ưu tiên giống cây phù hợp với khí hậu địa phương.</p>
      
      <h3>3. Phân bón hữu cơ</h3>
      <p><strong>Phân chuồng:</strong> Phân bò, phân gà đã ủ hoai.</p>
      <p><strong>Phân xanh:</strong> Cây họ đậu, cỏ linh lăng.</p>
      <p><strong>Compost:</strong> Tự làm phân compost từ rác thải nhà bếp.</p>
      
      <h3>4. Phòng trừ sâu bệnh tự nhiên</h3>
      <p><strong>Trồng xen canh:</strong> Trồng nhiều loại cây để tạo đa dạng sinh học.</p>
      <p><strong>Thiên địch:</strong> Nuôi ong, bướm để thụ phấn và diệt sâu hại.</p>
      <p><strong>Thuốc tự nhiên:</strong> Sử dụng nước tỏi, ớt để phòng trừ sâu bệnh.</p>
      
      <h3>5. Tưới nước và chăm sóc</h3>
      <p><strong>Tưới đều đặn:</strong> Tưới vào sáng sớm hoặc chiều tối.</p>
      <p><strong>Che phủ đất:</strong> Sử dụng rơm rạ, lá khô để giữ ẩm.</p>
      <p><strong>Theo dõi thường xuyên:</strong> Kiểm tra sâu bệnh và tình trạng cây trồng.</p>
    `
  },
  {
    id: "vertical-farming-future",
    title: "Nông nghiệp thẳng đứng: Tương lai của canh tác đô thị",
    date: "25 July 2025",
    author: "Lan Anh",
    image: "/src/assets/imgs/homeBlog2.png",
    category: "technology",
    tags: ["nông nghiệp thẳng đứng", "đô thị", "tương lai", "LED"],
    readTime: "9 phút",
    excerpt: "Khám phá mô hình nông nghiệp thẳng đứng - giải pháp cho việc sản xuất thực phẩm trong các thành phố đông đúc.",
    content: `
      <h2>Nông nghiệp thẳng đứng</h2>
      <p>Nông nghiệp thẳng đứng (Vertical Farming) là mô hình canh tác trong nhà, sử dụng không gian theo chiều dọc để tối đa hóa sản lượng.</p>
      
      <h3>1. Nguyên lý hoạt động</h3>
      <p><strong>Không gian dọc:</strong> Trồng cây trên nhiều tầng, tận dụng tối đa không gian.</p>
      <p><strong>Điều khiển môi trường:</strong> Kiểm soát nhiệt độ, độ ẩm, ánh sáng hoàn toàn.</p>
      <p><strong>Thủy canh/Aeroponic:</strong> Trồng cây không cần đất, sử dụng dung dịch dinh dưỡng.</p>
      
      <h3>2. Ưu điểm</h3>
      <p><strong>Tiết kiệm nước:</strong> Sử dụng ít nước hơn 95% so với canh tác truyền thống.</p>
      <p><strong>Không phụ thuộc thời tiết:</strong> Sản xuất quanh năm, không bị ảnh hưởng bởi thiên tai.</p>
      <p><strong>Gần thị trường:</strong> Giảm chi phí vận chuyển, đảm bảo độ tươi.</p>
      
      <h3>3. Công nghệ sử dụng</h3>
      <p><strong>LED grow lights:</strong> Đèn LED chuyên dụng cho cây trồng.</p>
      <p><strong>Hệ thống cảm biến:</strong> Theo dõi và điều chỉnh môi trường tự động.</p>
      <p><strong>Robot tự động:</strong> Gieo trồng, chăm sóc, thu hoạch tự động.</p>
      
      <h3>4. Ứng dụng tại Việt Nam</h3>
      <p>Một số startup Việt Nam đã bắt đầu triển khai mô hình này, tập trung vào rau xanh và thảo mộc.</p>
      
      <h3>5. Thách thức</h3>
      <p><strong>Chi phí đầu tư cao:</strong> Cần vốn lớn cho hệ thống công nghệ.</p>
      <p><strong>Tiêu thụ năng lượng:</strong> Cần nguồn điện ổn định cho hệ thống LED.</p>
      <p><strong>Kỹ thuật phức tạp:</strong> Cần nhân lực có chuyên môn cao.</p>
    `
  },
  {
    id: "seasonal-planting-guide",
    title: "Lịch trồng trọt theo mùa: Hướng dẫn chi tiết cho từng tháng",
    date: "28 July 2025",
    author: "Văn Đức",
    image: "/src/assets/imgs/homeBlog3.png",
    category: "gardening",
    tags: ["lịch trồng", "mùa vụ", "hướng dẫn", "theo tháng"],
    readTime: "11 phút",
    excerpt: "Lịch trồng trọt chi tiết cho từng tháng trong năm, giúp bạn lên kế hoạch canh tác hiệu quả nhất.",
    content: `
      <h2>Lịch trồng trọt theo mùa</h2>
      <p>Việc trồng đúng thời vụ không chỉ giúp cây phát triển tốt mà còn tối ưu hóa năng suất và chất lượng sản phẩm.</p>
      
      <h3>Tháng 1-2: Mùa khô</h3>
      <p><strong>Trồng:</strong> Cà chua, ớt, dưa chuột, đậu đũa.</p>
      <p><strong>Chăm sóc:</strong> Tưới nước đều đặn, che chắn cho cây con.</p>
      <p><strong>Thu hoạch:</strong> Rau xanh, củ cải, cà rốt.</p>
      
      <h3>Tháng 3-4: Chuyển mùa</h3>
      <p><strong>Trồng:</strong> Bắp cải, súp lơ, cải bó xôi.</p>
      <p><strong>Chăm sóc:</strong> Bón phân hữu cơ, phòng trừ sâu bệnh.</p>
      <p><strong>Thu hoạch:</strong> Cà chua, ớt, dưa chuột.</p>
      
      <h3>Tháng 5-6: Đầu mùa mưa</h3>
      <p><strong>Trồng:</strong> Rau muống, rau dền, mồng tơi.</p>
      <p><strong>Chăm sóc:</strong> Làm rãnh thoát nước, phòng bệnh nấm.</p>
      <p><strong>Thu hoạch:</strong> Bắp cải, súp lơ.</p>
      
      <h3>Tháng 7-8: Giữa mùa mưa</h3>
      <p><strong>Trồng:</strong> Đậu bắp, bí đỏ, bí xanh.</p>
      <p><strong>Chăm sóc:</strong> Che chắn khi mưa to, bón phân kali.</p>
      <p><strong>Thu hoạch:</strong> Rau muống, rau dền.</p>
      
      <h3>Tháng 9-10: Cuối mùa mưa</h3>
      <p><strong>Trồng:</strong> Cà rốt, củ cải, hành tây.</p>
      <p><strong>Chăm sóc:</strong> Chuẩn bị đất cho vụ mới.</p>
      <p><strong>Thu hoạch:</strong> Đậu bắp, bí đỏ.</p>
      
      <h3>Tháng 11-12: Mùa khô</h3>
      <p><strong>Trồng:</strong> Rau xanh, cải bắp, súp lơ.</p>
      <p><strong>Chăm sóc:</strong> Tưới nước, che chắn.</p>
      <p><strong>Thu hoạch:</strong> Cà rốt, củ cải.</p>
    `
  }
]
