import { graphql as __graphql, OperationOption } from "react-apollo";

export function graphql<TProps, TResult>(
  gqlQuery: any,
  operationOptions?: OperationOption<TProps, TResult>
): any {
  return __graphql(gqlQuery, operationOptions);
}

export default graphql;
