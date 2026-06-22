export function ok<T>(data: T, message = "ok") {
  return Response.json({
    success: true,
    message,
    data,
  });
}

export function fail(message: string, status = 400) {
  return Response.json(
    {
      success: false,
      message,
    },
    { status },
  );
}
