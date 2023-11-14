### mongo 安装

1. [下载 mongo 社区版](https://www.mongodb.com/try/download/community)
2. 打开/usr/local 目录，然后将解压的 mongodb 拖过去
3. 进入 mongodb 目录，创建 data/db 目录
4. 给 /data/db 设置读写权限

```bash
# 查看当前所系统在的username
$ whoami
->username
# 设置权限
$ sudo chown username /data/db
```

5.设置环境变量, 打开 ~/.bashrc 文件，添加配置:PATH=$PATH:/usr/local/mongodb/bin

```bash
open ~/.bash_profile

source ~/.bash_profile
```

6.配置启动，根目录新建 conf/mongo.conf

```bash
# 数据库路径
dbpath=/usr/local/mongodb/data
# 日志输出文件路径
logpath=/usr/local/mongodb/log/mongo.log
# 错误日志采用追加模式
logappend=true
# 启用日志文件，默认启用
# journal=true
# 过滤一些无用的日志信息，若需要调试设置为false
# quite=true
# 端口号 默认为27017
port=27017
# 是否需要校验，测试环境可以关闭，生产环境则需要打开
# auth=true
# 注册服务，这样就可以保证电脑启动服务就可以使用，避免每次关闭后还需要重新启动服务
fork=true
```

7.启动服务

```bash
cd /usr/local/mongodb/bin
./mongod --dbpath /usr/local/mongodb/bin
```

### 启动 server, 访问 localhot:17017/graphql

```bash
yarn install
yarn dev
```
