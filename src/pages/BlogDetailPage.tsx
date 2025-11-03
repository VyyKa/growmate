import { useParams, useNavigate } from "react-router-dom"
import { blogData, type BlogPost } from "../data/blogData"
import Breadcrumb from "../components/Breadcrumb"
import FacebookShareButton from "../components/FacebookShareButton"
import CopyLinkButton from "../components/CopyLinkButton"
import { getDefaultBlogBackground } from "../utils/helpers/blogHelpers"

const BlogDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Find blog post by ID
  const blogPost: BlogPost | undefined = blogData.find(blog => blog.id === id)

  if (!blogPost) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Không tìm thấy bài viết</h1>
          <p className="text-gray-600 mb-8">Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <button
            onClick={() => navigate("/blog")}
            className="bg-main text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors cursor-pointer"
          >
            Quay lại trang blog
          </button>
        </div>
      </div>
    )
  }

  const currentUrl = window.location.href

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-green-600 to-green-800 overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Background Image */}
        <div 
          className="absolute inset-0 blog-parallax"
          style={{ 
            backgroundImage: `url(${blogPost.image || getDefaultBlogBackground()})`
          }}
        ></div>

        <div className="relative h-full flex items-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              {/* Category Badge */}
              <div className="inline-block bg-white/20 backdrop-blur-md rounded-full px-4 py-2 text-white text-sm font-medium border border-white/30 mb-6">
                {blogPost.category === "tips" && "Mẹo Trồng Cây"}
                {blogPost.category === "news" && "Tin Tức"}
                {blogPost.category === "technology" && "Công Nghệ"}
                {blogPost.category === "gardening" && "Làm Vườn"}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {blogPost.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{blogPost.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span>{blogPost.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>{blogPost.readTime} đọc</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <article className="bg-white rounded-xl shadow-lg p-8">
                {/* Excerpt */}
                <div className="bg-green-50 border-l-4 border-main p-6 mb-8 rounded-r-lg">
                  <p className="text-lg text-gray-700 leading-relaxed italic">
                    {blogPost.excerpt}
                  </p>
                </div>

                {/* Content */}
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: blogPost.content }}
                />

                {/* Tags */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Từ khóa</h3>
                  <div className="flex flex-wrap gap-2">
                    {blogPost.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-main hover:text-white transition-colors cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Share Buttons */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Chia sẻ bài viết</h3>
                  <div className="flex gap-4">
                    <FacebookShareButton 
                      url={currentUrl} 
                      title={blogPost.title}
                      description={blogPost.excerpt}
                      imageUrl={blogPost.image}
                    />
                    <CopyLinkButton url={currentUrl} />
                  </div>
                </div>
              </article>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Author Info */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Tác giả</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-main rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {blogPost.author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{blogPost.author}</h4>
                      <p className="text-sm text-gray-600">Chuyên gia nông nghiệp</p>
                    </div>
                  </div>
                </div>

                {/* Related Posts */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Bài viết liên quan</h3>
                  <div className="space-y-4">
                    {blogData
                      .filter(blog => blog.category === blogPost.category && blog.id !== blogPost.id)
                      .slice(0, 3)
                      .map((relatedBlog) => (
                        <div
                          key={relatedBlog.id}
                          className="flex gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                          onClick={() => navigate(`/blog/${relatedBlog.id}`)}
                        >
                          <img
                            src={relatedBlog.image}
                            alt={relatedBlog.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800 text-sm line-clamp-2 mb-1">
                              {relatedBlog.title}
                            </h4>
                            <p className="text-xs text-gray-500">{relatedBlog.date}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Back to Blog */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <button
                    onClick={() => navigate("/blog")}
                    className="w-full bg-main text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors font-medium"
                  >
                    ← Quay lại trang blog
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BlogDetailPage
