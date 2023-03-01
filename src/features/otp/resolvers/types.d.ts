export class OtpResolver {
  static purpose: string;

  resolve(user: User): Promise<any>;
}
