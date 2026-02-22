import { useParams, Navigate } from "react-router-dom";
import ChapterLayout from "@/components/ebook/ChapterLayout";
import { chapters } from "@/data/ebookChapters";
import { ebookParts } from "@/data/ebookContent/index";

const EbookChapter = () => {
  const { parte } = useParams();
  const chapter = chapters.find((c) => c.slug === parte);

  if (!chapter) return <Navigate to="/ebook" replace />;

  const content = ebookParts[parte as keyof typeof ebookParts];

  return (
    <ChapterLayout
      chapters={chapters}
      currentSlug={chapter.slug}
      title={chapter.title}
      subtitle={chapter.subtitle}
    >
      {content?.content || <p className="text-lg text-muted-foreground">Conteúdo em breve...</p>}
    </ChapterLayout>
  );
};

export default EbookChapter;
