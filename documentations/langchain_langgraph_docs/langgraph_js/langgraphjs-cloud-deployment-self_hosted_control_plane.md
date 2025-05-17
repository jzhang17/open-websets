[Skip to content](#how-to-deploy-self-hosted-control-plane)

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm_source=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm_campaign=langgraphjs_docs)**

[![logo](../../../static/wordmark_dark.svg)
![logo](../../../static/wordmark_light.svg)](../../..)

How to Deploy Self-Hosted Control Plane

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
* [Setup](#setup)

# How to Deploy Self-Hosted Control Plane[¶](#how-to-deploy-self-hosted-control-plane "Permanent link")

Before deploying, review the [conceptual guide for the Self-Hosted Control Plane](../../concepts/langgraph_self_hosted_control_plane.md) deployment option.

Beta

The Self-Hosted Control Plane deployment option is currently in beta stage.

## Prerequisites[¶](#prerequisites "Permanent link")

1. You are using Kubernetes.
2. You have self-hosted LangSmith deployed.
3. Use the [LangGraph CLI](../../../concepts/langgraph_cli/) to [test your application locally](../../../tutorials/langgraph-platform/local-server/).
4. Use the [LangGraph CLI](../../../concepts/langgraph_cli/) to build a Docker image (i.e. `langgraph build`) and push it to a registry your Kubernetes cluster has access to.
5. `KEDA` is installed on your cluster.

   ```
    helm repo add kedacore https://kedacore.github.io/charts
    helm install keda kedacore/keda --namespace keda --create-namespace

   ```

   1. Ingress Configuration
   2. You must set up an ingress for your LangSmith instance. All agents will be deployed as Kubernetes services behind this ingress.
   3. You can use this guide to [set up an ingress](https://docs.smith.langchain.com/self_hosting/configuration/ingress) for your instance.
   4. You have slack space in your cluster for multiple deployments. `Cluster-Autoscaler` is recommended to automatically provision new nodes.
   5. A valid Dynamic PV provisioner or PVs available on your cluster. You can verify this by running:

      kubectl get storageclass

## Setup[¶](#setup "Permanent link")

1. As part of configuring your Self-Hosted LangSmith instance, you enable the `langgraphPlatform` option. This will provision a few key resources.
   1. `listener`: This is a service that listens to the [control plane](../../concepts/langgraph_control_plane.md) for changes to your deployments and creates/updates downstream CRDs.
   2. `LangGraphPlatform CRD`: A CRD for LangGraph Platform deployments. This contains the spec for managing an instance of a LangGraph platform deployment.
   3. `operator`: This operator handles changes to your LangGraph Platform CRDs.
   4. `host-backend`: This is the [control plane](../../concepts/langgraph_control_plane.md).
2. Two additional images will be used by the chart.

   ```
   hostBackendImage:
     repository: "docker.io/langchain/hosted-langserve-backend"
     pullPolicy: IfNotPresent
     tag: "0.9.80"
   operatorImage:
     repository: "docker.io/langchain/langgraph-operator"
     pullPolicy: IfNotPresent
     tag: "aa9dff4"

   ```
3. In your `values.yaml` file, enable the `langgraphPlatform` option. Note that you must also have a valid ingress setup:
   config:
   langgraphPlatform:
   enabled: true
   langgraphPlatformLicenseKey: "YOUR\_LANGGRAPH\_PLATFORM\_LICENSE\_KEY"
4. In your `values.yaml` file, configure the `hostBackendImage` and `operatorImage` options (if you need to mirror images)
5. You can also configure base templates for your agents by overriding the base templates [here](https://github.com/langchain-ai/helm/blob/main/charts/langsmith/values.yaml#L898).
6. You create a deployment from the [control plane UI](../../concepts/langgraph_control_plane.md#control-plane-ui).

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