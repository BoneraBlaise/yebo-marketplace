import React from "react";
import { useParams } from "react-router-dom";

const BlogDetails = ({ posts }) => {
    const { id } = useParams();
    const post = posts.find((p) => p.id === parseInt(id));

    if (!post) {
        return <div>Post not found!</div>;
    }

    return (
        <div className="px-6 py-10 bg-gray-100 dark:bg-[#1f1f1f]">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-bold text-black dark:text-white">
                    {post.title}
                </h1>
            </header>

            <section className="max-w-[70%] mx-auto">
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-md"
                />
                <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
                    {post.excerpt}
                </p>

                {/* Display full content */}
                <div className="mt-6 text-lg text-gray-700 dark:text-gray-300">
                    {post.fullContent.map((paragraph, index) => (
                        <p key={index} className="mt-4">
                            {paragraph}
                        </p>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default BlogDetails;
