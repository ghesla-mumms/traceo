<img src="https://github.com/traceo-dev/traceo/blob/develop/public/packages/app/public/traceo-fav.PNG" width="100px">

# Traceo
Traceo is an open-source, self-hosted set of tools for monitoring application health by collecting and aggregating data from the software. 

- Capture and collect all exceptions in one place
- Troubleshoot your code with immediate insight into where the problem is
- Monitor application resource consumption and visualize it on the dashboard
- Create your own visualizations to have quick access to the information you need
- Collect and view logs, metrics and spans

Gathering the information you need is done using the [Traceo SDK](https://github.com/traceo-io/traceo-node), a library for NodeJS that can be downloaded from npm. Implementations for more technologies and programming languages will also be added in the near future.

## Table of Contents

- [Installation](#installation)
- [Features](#features)
- [Documentation](#documentation)
- [SDK](#sdk)
- [Support](#support)
- [License](#license)
  
# Installation
Traceo is self-hosted software, so we recommend installing it using docker-compose. The easiest possible way to install using docker compose is to use the following one-liner:

```
$ curl -L https://raw.githubusercontent.com/traceo-dev/traceo/develop/docker-compose.yml -o docker-compose.yml && docker compose up -d
```
After invoking this command, the docker-compose.yml file will be downloaded and run on your machine.

Full installation guide can be found [here](https://github.com/traceo-dev/traceo/blob/develop/INSTALL.md).

# Features
With the following features you will be able to fully control your software

![20230727_130337 (1)](https://github.com/traceo-dev/traceo/assets/44099572/0d370693-dd64-4c14-8d5a-c6f04995fcc4)

- [Catch all exceptions in your software](https://github.com/traceo-dev/traceo-javascript/tree/develop/packages/node#incidents-handling)
- Collect [logs](https://github.com/traceo-dev/traceo-javascript/blob/develop/packages/node/README.md#logger), [metrics](https://github.com/traceo-dev/traceo-javascript/blob/develop/packages/opentelemetry-node/README.md#metrics) and [spans](https://github.com/traceo-dev/traceo-javascript/blob/develop/packages/opentelemetry-node/README.md#spans)
- Explore all information in one [place](https://github.com/traceo-dev/traceo/blob/develop/DOCUMENTATION.md#dashboards)
- Get [web-vitals](https://github.com/traceo-dev/traceo-javascript/tree/develop/packages/react#performance) data from your browser apps
- [Create](https://github.com/traceo-dev/traceo/blob/develop/DOCUMENTATION.md#create-new-panel) custom visual panels with the metrics that are important to you

And many more!

# Documentation
The full Traceo platform documentation can be found [here](https://github.com/traceo-dev/traceo/blob/develop/DOCUMENTATION.md). In case of problems, don't be afraid to start a discussion on Github.

# SDK
To start using the Traceo platform, you need to integrate with the [Traceo SDK](https://github.com/traceo-io/traceo-node). Information about the process of implementing the SDK in your software is included in the README file of each SDK.

- [`@traceo-sdk/node`](https://github.com/traceo-dev/traceo-sdk/tree/develop/packages/node) - NodeJS
- [`@traceo-sdk/opentelemetry-node`](https://github.com/traceo-dev/traceo-sdk/tree/develop/packages/opentelemetry-node) - Open Telemetry for NodeJS
- [`@traceo-sdk/react`](https://github.com/traceo-dev/traceo-sdk/tree/develop/packages/react) - React
- [`@traceo-sdk/vue`](https://github.com/traceo-dev/traceo-sdk/tree/develop/packages/vue) - Vue

Remember that for each version of the Traceo platform there may be a specific SDK version. You can monitor them in [Release](https://github.com/traceo-dev/traceo/releases).

# Support
Feel free to create Issues or Pull Request.

# License
Traceo is licensed under the [Apache License, Version 2.0](https://github.com/traceo-dev/traceo/blob/main/LICENSE).
