import { AwsAssumedRole as AwsAssumedRoleType } from '@tinystacks/ops-model';

class AwsAssumedRole implements AwsAssumedRoleType {
  roleArn: string;
  sessionName: string;

  constructor (
    roleArn: string,
    sessionName: string
  ) {
    this.roleArn = roleArn;
    this.sessionName = sessionName;
  }

  static fromObject (object: AwsAssumedRoleType): AwsAssumedRole {
    const {
      roleArn,
      sessionName
    } = object;
    return new AwsAssumedRole(
      roleArn,
      sessionName
    );
  }
}

export default AwsAssumedRole;