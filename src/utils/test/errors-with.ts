import { AppException } from '~/exceptions/app.exception';

export function throws(errorClass: { status: number; code: string }) {
  return ({ status, body }) => {
    expect(status).toEqual(errorClass.status);
    expect(body.code).toEqual(errorClass.code);
  };
}
