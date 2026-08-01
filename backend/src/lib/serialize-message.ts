export function serializeMessage<T extends { id: string; filePath?: string | null }>(msg: T) {
  const { filePath, ...rest } = msg;
  return {
    ...rest,
    fileUrl: filePath ? `/api/messages/${msg.id}/file` : null,
  };
}