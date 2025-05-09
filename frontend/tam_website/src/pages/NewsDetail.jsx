import React from 'react';
import { useParams } from 'react-router-dom';

const NewsDetail = () => {
  const { id } = useParams();

  // این داده‌ها بعداً از API دریافت خواهند شد
  const article = {
    id: 1,
    title: "Team Wins Championship",
    image: "/images/banners/ArticlePicture2.png",
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

    Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

    Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.

    Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.

    At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.

    Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.

    Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.

    Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.`
  };

  return (
    <div className="min-h-screen">
      {/* Hero Image */}
      <div className="w-full h-[708px] mt-4">
        <img 
          src={article.image} 
          alt={article.title} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Container */}
      <div className="w-full">
        <div className="grid grid-cols-12 gap-4 px-4 md:px-8 lg:px-[70px]">
          <div className="col-span-12 lg:col-span-8 relative -mt-[163px] mb-32">
            <div 
              className="w-full bg-quinary-tint-900 shadow-[0_0_16px_rgba(0,0,0,0.25)] p-8 min-h-[900px]"
            >
              <h1 className="text-[36px] font-bold text-secondary line-clamp-2">
                {article.title}
              </h1>
              <p className="text-[24px] font-regular text-secondary mt-6 whitespace-pre-line">
                {article.content}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail; 