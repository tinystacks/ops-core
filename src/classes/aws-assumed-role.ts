import { AwsAssumedRole as AwsAssumedRoleType, AwsKeys, LocalAwsProfile } from '@tinystacks/ops-model';

class AwsAssumedRole implements AwsAssumedRoleType {
  roleArn: string;
  sessionName: string;
  region: string; 
  primaryCredentials: (AwsKeys | AwsAssumedRole | LocalAwsProfile);
  duration?: number;

  constructor (
    roleArn: string,
    sessionName: string,
    region: string,
    primaryCredentials: (AwsKeys | AwsAssumedRole | LocalAwsProfile),
    duration?: number,
  ) {
    this.roleArn = roleArn;
    this.sessionName = sessionName;
    this.region = region; 
    this.primaryCredentials = primaryCredentials; 
    this.duration = duration;
  }

  static fromJson (object: AwsAssumedRoleType): AwsAssumedRole {
    const {
      roleArn,
      sessionName,
      region,
      primaryCredentials,
      duration
    } = object;
    return new AwsAssumedRole(
      roleArn,
      sessionName,
      region,
      primaryCredentials,
      duration
    );
  }
}

export default AwsAssumedRole;