import { AwsKeys as AwsKeysType } from '@tinystacks/ops-model';

class AwsKeys implements AwsKeysType {
  AwsAccessKeyId?: string;
  AwsSecretAccessKey?: string;
  AwsSessionToken?: string;

  constructor (
    AwsAccessKeyId: string,
    AwsSecretAccessKey: string,
    AwsSessionToken?: string
  ) {
    this.AwsAccessKeyId = AwsAccessKeyId;
    this.AwsSecretAccessKey = AwsSecretAccessKey;
    this.AwsSessionToken = AwsSessionToken;
  }

  static fromObject (object: AwsKeysType): AwsKeys {
    const {
      AwsAccessKeyId,
      AwsSecretAccessKey,
      AwsSessionToken
    } = object;
    return new AwsKeys(
      AwsAccessKeyId,
      AwsSecretAccessKey,
      AwsSessionToken
    );
  }
}

export default AwsKeys;