import { LocalAwsProfile as LocalAwsProfileType } from '@tinystacks/ops-model';

class LocalAwsProfile implements LocalAwsProfileType {
  profileName: string;

  constructor (
    profileName: string
  ) {
    this.profileName = profileName;
  }

  static fromObject (object: LocalAwsProfileType): LocalAwsProfile {
    const {
      profileName
    } = object;
    return new LocalAwsProfile(
      profileName
    );
  }
}

export default LocalAwsProfile;