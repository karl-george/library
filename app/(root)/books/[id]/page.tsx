import { auth } from '@/auth';
import BookOverview from '@/components/BookOverview';
import { db } from '@/database/drizzle';
import { books } from '@/database/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await auth();

  // Fetch data based on id
  const [bookDetails] = await db
    .select()
    .from(books)
    .where(eq(books.id, id))
    .limit(1);

  if (!bookDetails) redirect('/404');

  return (
    <>
      <BookOverview {...bookDetails} userId={session?.user?.id as string} />

      <div className='book-details'>
        <div className='flex-[1.5]'>
          <section className='flex flex-col gap-7'>
            <h3>Video</h3>

            {/* Video Component */}
          </section>

          {/* Summary */}
          <section className='mt-10 flex flex-col gap-7'>
            <h3>Summary</h3>
            {/* Split summary into paragraphs */}
            <div className='space-y-5 text-xl text-light-100'>
              {bookDetails.summary.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </section>
        </div>

        {/* Similar Books */}
      </div>
    </>
  );
};

export default Page;
