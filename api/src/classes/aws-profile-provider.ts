import { AwsCredentialsProvider as AwsProfileProviderType } from '@tinystacks/ops-model';
import AwsAssumedRole from './aws-assumed-role';
import AwsKeys from './aws-keys';
import LocalAwsProfile from './local-aws-profile';
import Provider from './provider';

class AwsProfileProvider extends Provider implements AwsProfileProviderType {
  static type = 'AwsProfileProvider';
  credentials: AwsKeys | AwsAssumedRole | LocalAwsProfile;

  constructor (
    id: string,
    credentials: AwsKeys | AwsAssumedRole | LocalAwsProfile
  ) {
    super(id, AwsProfileProvider.type);
    this.credentials = credentials;
  }

  static fromJson (object: AwsProfileProviderType): AwsProfileProvider {
    const {
      id,
      credentials
    } = object;
    return new AwsProfileProvider(
      id,
      credentials
    );
  }
}

export default AwsProfileProvider;