export function RegisterAppException(
  exceptionCode: string,
  status?: number,
): ClassDecorator {
  return (target: any) => {
    target.code = exceptionCode;
    target.status = status;
  };
}
