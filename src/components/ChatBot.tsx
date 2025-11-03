import React, { useState, useRef, useEffect } from "react"
import {
  MessageCircle,
  Send,
  X,
  Bot,
  User,
  Sprout,
  Maximize2,
  Minimize2,
} from "lucide-react"
import axiosClient, { API_BASE_URL } from "../services/axiosClient"

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  isSampleQuestion?: boolean
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "🌱 Xin chào! Tôi là chatbot thông minh của GrowMate. Tôi có thể trả lời mọi câu hỏi về website này. Hãy hỏi tôi bất cứ điều gì!",
      isUser: false,
      timestamp: new Date(),
    },
    {
      id: "2",
      text: "Web này dùng làm gì vậy?",
      isUser: false,
      timestamp: new Date(),
      isSampleQuestion: true,
    },
    {
      id: "3",
      text: "Danh sách cây có sẵn",
      isUser: false,
      timestamp: new Date(),
      isSampleQuestion: true,
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateAIResponse = async (question: string): Promise<any> => {
    // Tạo câu trả lời phù hợp dựa trên câu hỏi
    const lowerQuestion = question.toLowerCase()

    // Câu hỏi về mục đích website
    if (
      lowerQuestion.includes("dùng làm gì") ||
      lowerQuestion.includes("là gì") ||
      lowerQuestion.includes("mục đích")
    ) {
      return {
        response:
          `🌱 GrowMate là nền tảng nông nghiệp thông minh với nhiều chức năng:\n\n` +
          `• Nhận nuôi cây trồng từ xa - Theo dõi quá trình phát triển của cây\n` +
          `• Mua sắm sản phẩm nông nghiệp - Rau củ quả tươi từ nông trại uy tín\n` +
          `• Chia sẻ kiến thức - Blog về kỹ thuật trồng trọt và chăm sóc cây\n` +
          `• Kết nối cộng đồng - Giao lưu với nông dân và người yêu nông nghiệp\n` +
          `• Hỗ trợ nông nghiệp bền vững - Góp phần phát triển nông nghiệp xanh\n\n` +
          `Mục tiêu của GrowMate là tạo cầu nối giữa người dân thành thị và nông nghiệp, giúp mọi người có thể tham gia vào quá trình sản xuất thực phẩm sạch!`,
      }
    }

    // Câu hỏi về chức năng
    if (
      lowerQuestion.includes("chức năng") ||
      lowerQuestion.includes("tính năng") ||
      lowerQuestion.includes("có gì")
    ) {
      return {
        response:
          `🚀 GrowMate có 5 chức năng chính:\n\n` +
          `1. Trang chủ - Giới thiệu và sản phẩm nổi bật\n` +
          `2. Adopt - Nhận nuôi cây trồng từ các nông trại\n` +
          `3. Products - Mua sắm sản phẩm nông nghiệp tươi ngon\n` +
          `4. Blog - Học hỏi kiến thức nông nghiệp từ chuyên gia\n` +
          `5. About - Tìm hiểu về đội ngũ và tầm nhìn GrowMate\n\n` +
          `Mỗi chức năng đều được thiết kế để mang lại trải nghiệm tốt nhất cho người dùng!`,
      }
    }

    // Câu hỏi về cách sử dụng
    if (
      lowerQuestion.includes("cách") ||
      lowerQuestion.includes("làm thế nào") ||
      lowerQuestion.includes("hướng dẫn")
    ) {
      return {
        response:
          `📖 Hướng dẫn sử dụng GrowMate:\n\n` +
          `• Để nhận nuôi cây: Vào trang Adopt → Chọn cây yêu thích → Đăng ký nhận nuôi\n` +
          `• Để mua sản phẩm: Vào trang Products → Chọn sản phẩm → Thêm vào giỏ → Thanh toán\n` +
          `• Để đọc blog: Vào trang Blog → Chọn bài viết quan tâm → Đọc và học hỏi\n` +
          `• Để liên hệ: Vào trang Contact → Gửi tin nhắn hoặc gọi hotline\n\n` +
          `Giao diện thân thiện, dễ sử dụng cho mọi lứa tuổi!`,
      }
    }

    // Câu hỏi về lợi ích
    if (
      lowerQuestion.includes("lợi ích") ||
      lowerQuestion.includes("tại sao") ||
      lowerQuestion.includes("ưu điểm")
    ) {
      return {
        response:
          `✨ Lợi ích khi sử dụng GrowMate:\n\n` +
          `• Thực phẩm sạch - Đảm bảo nguồn gốc và chất lượng\n` +
          `• Tiết kiệm chi phí - Mua trực tiếp từ nông trại, giá tốt\n` +
          `• Học hỏi kinh nghiệm - Kiến thức nông nghiệp từ chuyên gia\n` +
          `• Bảo vệ môi trường - Hỗ trợ nông nghiệp bền vững\n` +
          `• Trải nghiệm thú vị - Theo dõi quá trình phát triển của cây\n` +
          `• Cộng đồng gắn kết - Kết nối với những người cùng đam mê\n\n` +
          `GrowMate mang đến trải nghiệm nông nghiệp hoàn toàn mới!`,
      }
    }

    // Câu hỏi mặc định
    return {
      response:
        `🌱 GrowMate là nền tảng nông nghiệp thông minh giúp bạn:\n\n` +
        `• Kết nối với các nông trại uy tín\n` +
        `• Nhận nuôi và theo dõi cây trồng từ xa\n` +
        `• Mua sắm sản phẩm nông nghiệp chất lượng cao\n` +
        `• Học hỏi kiến thức nông nghiệp qua blog\n` +
        `• Tham gia cộng đồng yêu thích nông nghiệp\n\n` +
        `Hãy khám phá các chức năng của GrowMate để trải nghiệm nông nghiệp thông minh!`,
    }
  }

  const callAPI = async (
    endpoint: string,
    method: string = "GET",
    data?: any
  ) => {
    console.log("🚀 Calling API:", { endpoint, method, data })

    // Handle special endpoints that don't need real API calls
    if (endpoint === "/team") {
      console.log("👥 Returning team data directly")
      return { team: "GrowMate Team" }
    }

    if (endpoint === "/ai-response") {
      console.log("🤖 Generating AI response for:", data.question)
      return await generateAIResponse(data.question)
    }

    try {
      let response
      switch (method) {
        case "GET":
          console.log("📡 Making GET request to:", endpoint)
          response = await axiosClient.get(endpoint)
          break
        case "POST":
          console.log(
            "📡 Making POST request to:",
            endpoint,
            "with data:",
            data
          )
          response = await axiosClient.post(endpoint, data)
          break
        case "PUT":
          console.log("📡 Making PUT request to:", endpoint, "with data:", data)
          response = await axiosClient.put(endpoint, data)
          break
        case "DELETE":
          console.log("📡 Making DELETE request to:", endpoint)
          response = await axiosClient.delete(endpoint)
          break
        default:
          throw new Error("Unsupported method")
      }
      console.log("✅ API Response:", response.data)
      return response.data
    } catch (error: any) {
      console.error("❌ API Error:", error)
      console.error("Error details:", {
        message: error?.message || "Unknown error",
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
      })

      // Handle specific error types
      if (error?.code === "ERR_NETWORK" || error?.message === "Network Error") {
        const networkError = new Error(
          "Không thể kết nối đến server API. Vui lòng kiểm tra xem backend server đã chạy chưa."
        )
        networkError.name = "NetworkError"
        throw networkError
      }

      // Handle 401 Unauthorized error
      if (error?.response?.status === 401) {
        const authError = new Error(
          "API yêu cầu xác thực. Vui lòng đăng nhập để sử dụng chatbot."
        )
        authError.name = "AuthError"
        throw authError
      }

      // Handle 503 Service Unavailable or 500 Internal Server Error
      if (error?.response?.status === 503 || error?.response?.status === 500) {
        const overloadError = new Error(
          "Hệ thống đang bị quá tải. Vui lòng thử lại sau."
        )
        overloadError.name = "OverloadError"
        throw overloadError
      }

      throw error
    }
  }

  const formatAPIResponse = (data: any, endpoint: string): string => {
    if (!data) return "Không có dữ liệu trả về."

    // Handle paginated responses
    let items = data
    if (data && typeof data === "object" && data.items) {
      items = data.items
    } else if (data && typeof data === "object" && data.data) {
      items = data.data
    }

    // Format based on endpoint type
    if (endpoint.includes("/products/approved")) {
      if (Array.isArray(items)) {
        if (items.length === 0) {
          return "📦 Không có sản phẩm nào được phê duyệt."
        }
        return `📦 Danh sách sản phẩm đã được phê duyệt (${
          items.length
        } sản phẩm):\n\n${items
          .map(
            (product: any, index: number) =>
              `${index + 1}. ${product.name || "N/A"}\n   - ID: ${
                product.id
              }\n   - Giá: ${
                product.price
                  ? `${product.price.toLocaleString("vi-VN")} VNĐ`
                  : "N/A"
              }\n   - Mô tả: ${
                product.description || "N/A"
              }\n   - Trạng thái: ${product.status || "N/A"}\n`
          )
          .join("\n")}`
      }
    } else if (endpoint.includes("/Tree")) {
      if (Array.isArray(items)) {
        if (items.length === 0) {
          return "🌳 Không có cây nào trong hệ thống."
        }
        console.log("🌳 Raw tree data:", items[0]) // Debug first tree
        console.log("🌳 Available keys:", Object.keys(items[0] || {}))

        return `🌳 Danh sách cây (${items.length} cây):\n\n${items
          .map((tree: any, index: number) => {
            // Show all available fields for debugging
            const availableFields = Object.keys(tree).filter(
              (key) =>
                tree[key] !== null &&
                tree[key] !== undefined &&
                tree[key] !== ""
            )
            const fieldsInfo =
              availableFields.length > 0
                ? `\n   - Các trường có dữ liệu: ${availableFields.join(", ")}`
                : "\n   - Không có dữ liệu bổ sung"

            return `${index + 1}. ${
              tree.name || tree.treeName || tree.title || "N/A"
            }\n   - ID: ${tree.id || tree.treeId || "N/A"}${fieldsInfo}`
          })
          .join(
            "\n"
          )}\n\n*Lưu ý: Đang hiển thị cấu trúc dữ liệu thực tế từ API. Một số trường có thể không có dữ liệu.*`
      }
    } else if (endpoint.includes("/posts")) {
      if (Array.isArray(items)) {
        if (items.length === 0) {
          return "📝 Không có dữ liệu nào trong hệ thống."
        }

        // Check if this is adopt/tree data (posts with productName)
        const isAdoptData = items.some((item) => item.productName)

        if (isAdoptData) {
          return `🌳 Danh sách cây trồng (${items.length} cây):\n\n${items
            .map((post: any, index: number) => {
              const displayId = `BDX${String(post.postId).padStart(3, "0")}`
              const title = `${post.productName} - ${post.productVariety} - ${post.farmName}`
              const unit = `${post.harvestWeight} ${post.unit} / năm`
              const price = post.pricePerYear
                ? `${post.pricePerYear.toLocaleString("vi-VN")} VNĐ`
                : "N/A"

              return `${
                index + 1
              }. ${title}\n   - ID: ${displayId}\n   - Sản lượng: ${unit}\n   - Giá: ${price}\n   - Nông trại: ${
                post.farmName || "N/A"
              }\n`
            })
            .join("\n")}`
        } else {
          // Regular posts
          return `📝 Danh sách bài viết (${items.length} bài):\n\n${items
            .map(
              (post: any, index: number) =>
                `${index + 1}. ${post.title || "N/A"}\n   - ID: ${
                  post.id
                }\n   - Tác giả: ${post.authorName || "N/A"}\n   - Ngày tạo: ${
                  post.createdAt
                    ? new Date(post.createdAt).toLocaleDateString("vi-VN")
                    : "N/A"
                }\n   - Trạng thái: ${post.status || "N/A"}\n   - Mô tả: ${
                  post.content ? post.content.substring(0, 100) + "..." : "N/A"
                }\n`
            )
            .join("\n")}`
        }
      }
    } else if (endpoint.includes("/Cart")) {
      if (Array.isArray(items)) {
        if (items.length === 0) {
          return "🛒 Giỏ hàng của bạn đang trống."
        }
        return `🛒 Giỏ hàng của bạn (${items.length} sản phẩm):\n\n${items
          .map(
            (item: any, index: number) =>
              `${index + 1}. ${item.productName || "N/A"}\n   - Số lượng: ${
                item.quantity || "N/A"
              }\n   - Giá: ${
                item.price ? `${item.price.toLocaleString("vi-VN")} VNĐ` : "N/A"
              }\n`
          )
          .join("\n")}`
      }
      return `🛒 Giỏ hàng:\n\n\`\`\`json\n${JSON.stringify(
        data,
        null,
        2
      )}\n\`\`\``
    } else if (endpoint.includes("/Order")) {
      if (Array.isArray(items)) {
        if (items.length === 0) {
          return "📋 Bạn chưa có đơn hàng nào."
        }
        return `📋 Danh sách đơn hàng (${items.length} đơn):\n\n${items
          .map(
            (order: any, index: number) =>
              `${index + 1}. Đơn hàng #${order.id}\n   - Tổng tiền: ${
                order.totalAmount
                  ? `${order.totalAmount.toLocaleString("vi-VN")} VNĐ`
                  : "N/A"
              }\n   - Trạng thái: ${order.status || "N/A"}\n   - Ngày tạo: ${
                order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString("vi-VN")
                  : "N/A"
              }\n`
          )
          .join("\n")}`
      }
    } else if (endpoint.includes("/team")) {
      return (
        `Đội ngũ phát triển GrowMate:\n\n` +
        `CEO - Hồ Tài Liên Vy Kha\n` +
        `• Trưởng nhóm & Hỗ trợ kỹ thuật\n\n` +
        `CFO - Vũ Hà Trang\n` +
        `• Kế hoạch tiếp thị & Nghiên cứu thị trường\n\n` +
        `CTO - Nguyễn Minh Quang\n` +
        `• Backend & Database\n\n` +
        `CPO - Trương Đình Khoa\n` +
        `• UI/UX Design\n\n` +
        `COO - Lê Tiến Đạt\n` +
        `• Frontend & Database\n\n` +
        `Chatbot này được tạo ra bởi đội ngũ GrowMate để hỗ trợ người dùng tìm hiểu về các API và chức năng của hệ thống. Chúng tôi luôn sẵn sàng hỗ trợ bạn! 🌱`
      )
    } else if (endpoint.includes("/ai-response")) {
      return data.response || "Xin lỗi, tôi không thể trả lời câu hỏi này."
    }

    // Default formatting - show raw data for debugging
    console.log("📊 Using default formatting for data:", data)
    return `📊 Dữ liệu từ API (${endpoint}):\n\n\`\`\`json\n${JSON.stringify(
      data,
      null,
      2
    )}\n\`\`\`\n\n*Lưu ý: Đang hiển thị dữ liệu thô để debug. Cấu trúc dữ liệu có thể khác với mong đợi.*`
  }

  const analyzeQuestion = (
    question: string
  ): { endpoint: string; method: string; data?: any } | null => {
    console.log("🔍 Analyzing question:", question)
    const lowerQuestion = question.toLowerCase()
    console.log("🔍 Lowercase question:", lowerQuestion)

    // Tree related queries (using posts API for adopt page)
    if (
      lowerQuestion.includes("cây") ||
      lowerQuestion.includes("tree") ||
      lowerQuestion.includes("adopt")
    ) {
      console.log("🌳 Tree/Adopt keyword detected")
      if (
        lowerQuestion.includes("danh sách") ||
        lowerQuestion.includes("list") ||
        lowerQuestion.includes("tất cả") ||
        lowerQuestion.includes("liệt kê") ||
        lowerQuestion.includes("liệ kê") ||
        lowerQuestion.includes("liet ke")
      ) {
        console.log("🌳 List keyword detected for trees/adopt")
        return { endpoint: "/posts", method: "GET" }
      }
    }

    // Product related queries
    if (
      lowerQuestion.includes("sản phẩm") ||
      lowerQuestion.includes("product")
    ) {
      console.log("📦 Product keyword detected")
      if (
        lowerQuestion.includes("danh sách") ||
        lowerQuestion.includes("list") ||
        lowerQuestion.includes("tất cả") ||
        lowerQuestion.includes("liệt kê") ||
        lowerQuestion.includes("liệ kê") ||
        lowerQuestion.includes("liet ke")
      ) {
        console.log("📦 List keyword detected for products")
        return { endpoint: "/products/approved", method: "GET" }
      }
    }

    // Post related queries
    if (
      lowerQuestion.includes("bài viết") ||
      lowerQuestion.includes("post") ||
      lowerQuestion.includes("blog")
    ) {
      console.log("📝 Post keyword detected")
      if (
        lowerQuestion.includes("danh sách") ||
        lowerQuestion.includes("list") ||
        lowerQuestion.includes("tất cả") ||
        lowerQuestion.includes("liệt kê") ||
        lowerQuestion.includes("liệ kê") ||
        lowerQuestion.includes("liet ke")
      ) {
        console.log("📝 List keyword detected for posts")
        return { endpoint: "/posts", method: "GET" }
      }
    }

    // Cart related queries (simulate overload)
    if (lowerQuestion.includes("giỏ hàng") || lowerQuestion.includes("cart")) {
      console.log("🛒 Cart keyword detected - simulating overload")
      const overloadError = new Error(
        "Hệ thống đang bị quá tải. Vui lòng thử lại sau."
      )
      overloadError.name = "OverloadError"
      throw overloadError
    }

    // Order related queries (simulate overload)
    if (lowerQuestion.includes("đơn hàng") || lowerQuestion.includes("order")) {
      console.log("📋 Order keyword detected - simulating overload")
      if (
        lowerQuestion.includes("danh sách") ||
        lowerQuestion.includes("list") ||
        lowerQuestion.includes("tất cả") ||
        lowerQuestion.includes("liệt kê") ||
        lowerQuestion.includes("liệ kê") ||
        lowerQuestion.includes("liet ke")
      ) {
        console.log("📋 List keyword detected for orders - simulating overload")
        const overloadError = new Error(
          "Hệ thống đang bị quá tải. Vui lòng thử lại sau."
        )
        overloadError.name = "OverloadError"
        throw overloadError
      }
    }

    // Team/About queries
    if (
      lowerQuestion.includes("ai tạo") ||
      lowerQuestion.includes("tạo ra") ||
      lowerQuestion.includes("team") ||
      lowerQuestion.includes("nhóm") ||
      lowerQuestion.includes("đội ngũ") ||
      lowerQuestion.includes("about")
    ) {
      console.log("👥 Team/About keyword detected")
      return { endpoint: "/team", method: "GET" }
    }

    // General website questions - use AI response
    if (
      lowerQuestion.includes("growmate") ||
      lowerQuestion.includes("website") ||
      lowerQuestion.includes("trang web") ||
      lowerQuestion.includes("hệ thống") ||
      lowerQuestion.includes("dự án") ||
      lowerQuestion.includes("ứng dụng") ||
      lowerQuestion.includes("là gì") ||
      lowerQuestion.includes("làm gì") ||
      lowerQuestion.includes("chức năng") ||
      lowerQuestion.includes("tính năng") ||
      lowerQuestion.includes("có gì") ||
      lowerQuestion.includes("hoạt động") ||
      lowerQuestion.includes("mục đích") ||
      lowerQuestion.includes("giá trị") ||
      lowerQuestion.includes("lợi ích")
    ) {
      console.log("🌐 General website question detected")
      return {
        endpoint: "/ai-response",
        method: "POST",
        data: { question: inputValue },
      }
    }

    console.log("❓ No matching keywords found")
    return null
  }

  const handleSampleQuestionClick = (question: string) => {
    setInputValue(question)
    sendMessage(question)
  }

  const sendMessage = async (customQuestion?: string) => {
    const question = customQuestion || inputValue
    if (!question.trim() || isLoading) return

    console.log("💬 User input:", question)

    const userMessage: Message = {
      id: Date.now().toString(),
      text: question,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    if (!customQuestion) {
      setInputValue("")
    }
    setIsLoading(true)

    try {
      // Analyze the question to determine which API to call
      const apiCall = analyzeQuestion(question)
      console.log("🎯 API call determined:", apiCall)

      if (apiCall) {
        // Call the actual API
        console.log("📞 Calling API with:", apiCall)
        const data = await callAPI(
          apiCall.endpoint,
          apiCall.method,
          apiCall.data
        )
        console.log("📊 Raw API data:", data)
        console.log("📊 Data type:", typeof data)
        console.log("📊 Is array:", Array.isArray(data))
        if (Array.isArray(data) && data.length > 0) {
          console.log("📊 First item structure:", Object.keys(data[0]))
          console.log("📊 First item values:", data[0])
        }

        const formattedResponse = formatAPIResponse(data, apiCall.endpoint)
        console.log("✨ Formatted response:", formattedResponse)

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: formattedResponse,
          isUser: false,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, botMessage])
      } else {
        // Fallback to general help
        console.log("❓ No API call found, showing help message")
        const helpMessage =
          `🤖 Tôi có thể giúp bạn:\n\n` +
          `• Trả lời câu hỏi về GrowMate\n` +
          `• Liệt kê danh sách cây và sản phẩm\n` +
          `• Hiển thị bài viết/blog\n` +
          `• Giải thích chức năng website\n` +
          `• Hướng dẫn sử dụng\n` +
          `• Tìm hiểu về đội ngũ\n\n` +
          `Hãy hỏi tôi bất cứ điều gì!`

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: helpMessage,
          isUser: false,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, botMessage])
      }
    } catch (error: any) {
      console.error("💥 Error in sendMessage:", error)

      let errorText =
        "❌ Xin lỗi, đã có lỗi xảy ra khi gọi API. Vui lòng kiểm tra kết nối mạng và thử lại sau."

      if (error.name === "NetworkError") {
        errorText =
          `❌ **Lỗi kết nối API:**\n\n` +
          `Không thể kết nối đến server API tại \`${API_BASE_URL}\`\n\n` +
          `**Nguyên nhân có thể:**\n` +
          `• Backend server chưa được khởi động\n` +
          `• Server không chạy trên Azure\n` +
          `• Có vấn đề với HTTPS certificate\n\n` +
          `**Giải pháp:**\n` +
          `1. Kiểm tra server Azure có hoạt động\n` +
          `2. Thử truy cập trực tiếp vào API endpoint\n` +
          `3. Kiểm tra kết nối mạng`
      } else if (error.name === "AuthError") {
        errorText =
          `🔐 **Lỗi xác thực API:**\n\n` +
          `API yêu cầu đăng nhập để truy cập dữ liệu.\n\n` +
          `**Giải pháp:**\n` +
          `1. Đăng nhập vào tài khoản GrowMate\n` +
          `2. Sau khi đăng nhập, chatbot sẽ có thể truy cập dữ liệu\n` +
          `3. Hoặc thử các API công khai như sản phẩm đã phê duyệt\n\n` +
          `**Lưu ý:** Một số API như Tree, Order, Cart yêu cầu xác thực.`
      } else if (error.name === "OverloadError") {
        errorText =
          `⚠️ **Hệ thống đang bị quá tải:**\n\n` +
          `API hiện tại đang gặp sự cố hoặc quá tải.\n\n` +
          `**Vui lòng thử:**\n` +
          `• Thử lại sau vài phút\n` +
          `• Sử dụng các API khác như sản phẩm hoặc bài viết\n` +
          `• Liên hệ hỗ trợ nếu vấn đề tiếp tục\n\n` +
          `*Cảm ơn bạn đã kiên nhẫn!* 😊`
      }

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorText,
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      console.log("🏁 Message processing completed")
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
        >
          <div className="relative">
            <Sprout
              size={24}
              className="relative z-10 group-hover:scale-110 transition-transform duration-300 ease-in-out"
            />
            {/* Ripple effect 1 */}
            <div className="absolute inset-0 rounded-full bg-green-400 opacity-30 animate-ping"></div>
            {/* Ripple effect 2 */}
            <div
              className="absolute inset-0 rounded-full bg-green-300 opacity-20 animate-ping"
              style={{ animationDelay: "0.5s" }}
            ></div>
            {/* Ripple effect 3 */}
            <div
              className="absolute inset-0 rounded-full bg-green-200 opacity-10 animate-ping"
              style={{ animationDelay: "1s" }}
            ></div>
            {/* Hover effect */}
            <div className="absolute inset-0 rounded-full bg-green-400 opacity-0 group-hover:opacity-20 group-hover:scale-125 transition-all duration-300"></div>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col transition-all duration-300 ${
            isMaximized
              ? "w-[90vw] h-[90vh] top-[5vh] left-[5vw]"
              : "w-96 h-[500px]"
          }`}
        >
          {/* Header */}
          <div className="bg-green-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot size={20} />
              <span className="font-semibold">Chatbot Growmate</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                className="text-white hover:text-gray-200 transition-colors p-1 rounded hover:bg-green-700"
                title={isMaximized ? "Thu nhỏ" : "Phóng to"}
              >
                {isMaximized ? (
                  <Minimize2 size={18} />
                ) : (
                  <Maximize2 size={18} />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors p-1 rounded hover:bg-green-700"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isUser
                      ? "bg-green-500 text-white shadow-sm"
                      : message.isSampleQuestion
                      ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-2 border-green-200 cursor-pointer hover:from-green-100 hover:to-emerald-100 hover:border-green-300 hover:shadow-md transition-all duration-200"
                      : "bg-gray-50 text-gray-700 border border-gray-200"
                  }`}
                  onClick={
                    message.isSampleQuestion
                      ? () => handleSampleQuestionClick(message.text)
                      : undefined
                  }
                >
                  <div className="flex items-start space-x-2">
                    {!message.isUser && !message.isSampleQuestion && (
                      <Bot size={16} className="mt-1 flex-shrink-0" />
                    )}
                    {message.isUser && (
                      <User size={16} className="mt-1 flex-shrink-0" />
                    )}
                    {message.isSampleQuestion && (
                      <MessageCircle
                        size={16}
                        className="mt-1 flex-shrink-0 text-green-600"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap">
                        {message.text}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        {message.isSampleQuestion && (
                          <p className="text-xs text-green-600 font-medium">
                            Click để hỏi
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg max-w-[80%]">
                  <div className="flex items-center space-x-2">
                    <Bot size={16} />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập câu hỏi tại đây..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage("")}
                disabled={!inputValue.trim() || isLoading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatBot
