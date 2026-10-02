import { notFound } from "next/navigation";
import { getSequenceById } from "@/lib/sequences";
import SequenceDetailClient from "@/components/SequenceDetailClient";

export default async function SequenceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sequence = getSequenceById(id);

  if (!sequence) notFound();

  return <SequenceDetailClient sequence={sequence} />;
}
