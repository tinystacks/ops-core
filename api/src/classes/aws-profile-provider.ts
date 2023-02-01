import { AwsProfileProvider as AwsProfileProviderType } from '@tinystacks/ops-model';
import AwsAssumedRole from './aws-assumed-role';
import AwsKeys from './aws-keys';
import LocalAwsProfile from './local-aws-profile';
import Provider from './provider';

class AwsProfileProvider extends Provider implements AwsProfileProviderType {
  credentials?: AwsAssumedRole | AwsKeys | LocalAwsProfile;

  constructor (
    id: string,
    credentials?: AwsAssumedRole | AwsKeys | LocalAwsProfile
  ) {
    super(id);
    this.credentials = credentials;
  }

  static fromObject (object: AwsProfileProviderType): AwsProfileProvider {
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