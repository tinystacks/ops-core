import { AwsAssumedRole as AwsAssumedRoleType, AwsKeys, LocalAwsProfile } from '@tinystacks/ops-model';

class AwsAssumedRole implements AwsAssumedRoleType {
  roleArn: string;
  sessionName: string;
  primaryAwsProfileProvider: AwsKeys | AwsAssumedRoleType | LocalAwsProfile;

  constructor (
    roleArn: string,
    sessionName: string,
    primaryAwsProfileProvider: AwsKeys | AwsAssumedRoleType | LocalAwsProfile
  ) {
    this.roleArn = roleArn;
    this.sessionName = sessionName;
    this.primaryAwsProfileProvider = primaryAwsProfileProvider;
  }

  static fromJson (object: AwsAssumedRoleType): AwsAssumedRole {
    const {
      roleArn,
      sessionName,
      primaryAwsProfileProvider
    } = object;
    return new AwsAssumedRole(
      roleArn,
      sessionName,
      primaryAwsProfileProvider
    );
  }
}

export default AwsAssumedRole;