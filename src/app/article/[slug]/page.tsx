type Props = {
  params: Promise<{
    slug: string
  }>;
};

export async function generateMetaData({params}:Props){
  const { slug } = await params;
  return{
    title: `${slug} | IndoWikipedia`,
    description: `Read about ${slug}`,
  };
}


export default async function Article({params}: Props) {
  const {slug} = await params;
  return (
    <>
    <h1>{slug}</h1>
    </>
  );
}