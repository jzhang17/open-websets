[Skip to content](#how-to-deploy-self-hosted-data-plane)

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm_source=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm_campaign=langgraphjs_docs)**

[![logo](../../../static/wordmark_dark.svg)
![logo](../../../static/wordmark_light.svg)](../../..)

How to Deploy Self-Hosted Data Plane

Initializing search

[GitHub](https://github.com/langchain-ai/langgraphjs "Go to repository")

* [LangGraph](../../..)
* [Agents](../../../agents/overview/)
* [API reference](../../../reference/)
* [Versions](../../../versions/)

[![logo](../../../static/wordmark_dark.svg)
![logo](../../../static/wordmark_light.svg)](../../..)

[GitHub](https://github.com/langchain-ai/langgraphjs "Go to repository")

* [LangGraph](../../..)
* [Agents](../../../agents/overview/)
* [API reference](../../../reference/)
* [Versions](../../../versions/)

Table of contents

* [Prerequisites](#prerequisites)
* [Kubernetes](#kubernetes)

  + [Prerequisites](#prerequisites_1)
  + [Setup](#setup)
* [Amazon ECS](#amazon-ecs)

# How to Deploy Self-Hosted Data Plane[¶](#how-to-deploy-self-hosted-data-plane "Permanent link")

Before deploying, review the [conceptual guide for the Self-Hosted Data Plane](../../concepts/langgraph_self_hosted_data_plane.md) deployment option.

Beta

The Self-Hosted Data Plane deployment option is currently in beta stage.

## Prerequisites[¶](#prerequisites "Permanent link")

1. Use the [LangGraph CLI](../../../concepts/langgraph_cli/) to [test your application locally](../../../tutorials/langgraph-platform/local-server/).
2. Use the [LangGraph CLI](../../../concepts/langgraph_cli/) to build a Docker image (i.e. `langgraph build`) and push it to a registry your Kubernetes cluster or Amazon ECS cluster has access to.

## Kubernetes[¶](#kubernetes "Permanent link")

### Prerequisites[¶](#prerequisites_1 "Permanent link")

1. `KEDA` is installed on your cluster.

   ```
   helm repo add kedacore https://kedacore.github.io/charts
   helm install keda kedacore/keda --namespace keda --create-namespace

   ```
2. A valid `Ingress` controller is install on your cluster.
3. You have slack space in your cluster for multiple deployments. `Cluster-Autoscaler` is recommended to automatically provision new nodes.

### Setup[¶](#setup "Permanent link")

1. You give us your LangSmith organization ID. We will enable the Self-Hosted Data Plane for your organization.
2. We provide you a [Helm chart](https://github.com/langchain-ai/helm/tree/main/charts/langgraph-dataplane) which you run to setup your Kubernetes cluster. This chart contains a few important components.
   1. `langgraph-listener`: This is a service that listens to LangChain's [control plane](../../concepts/langgraph_control_plane.md) for changes to your deployments and creates/updates downstream CRDs.
   2. `LangGraphPlatform CRD`: A CRD for LangGraph Platform deployments. This contains the spec for managing an instance of a LangGraph Platform deployment.
   3. `langgraph-platform-operator`: This operator handles changes to your LangGraph Platform CRDs.
3. Configure your `langgraph-dataplane-values.yaml` file.

   ```
   config:
     langgraphPlatformLicenseKey: "" # Your LangGraph Platform license key
     langsmithApiKey: "" # API Key of your Workspace
     langsmithWorkspaceId: "" # Workspace ID
     hostBackendUrl: "https://api.host.langchain.com" # Only override this if on EU
     smithBackendUrl: "https://api.smith.langchain.com" # Only override this if on EU

   ```
4. Deploy `langgraph-dataplane` Helm chart.

   ```
   helm repo add langchain https://langchain-ai.github.io/helm/
   helm repo update
   helm upgrade -i langgraph-dataplane langchain/langgraph-dataplane --values langgraph-dataplane-values.yaml

   ```
5. If successful, you will see two services start up in your namespace.

   ```
   NAME                                          READY   STATUS              RESTARTS   AGE
   langgraph-dataplane-listener-7fccd788-wn2dx   0/1     Running             0          9s
   langgraph-dataplane-redis-0                   0/1     ContainerCreating   0          9s

   ```
6. You create a deployment from the [control plane UI](../../concepts/langgraph_control_plane.md#control-plane-ui).

## Amazon ECS[¶](#amazon-ecs "Permanent link")

Coming soon!

Was this page helpful?

Thanks for your feedback!

Thanks for your feedback! Please help us improve this page by adding to the discussion below.

Back to top

Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)

Made with
[Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept
Reject