# 什么是SOAP/REST/GRAPHQL/OPENAPI

## SOAP

​	SOAP（Simple Object Access Protocol）简单对象访问协议是交换数据的一种协议规范，是一种轻量的、简单的、**基于XML**（标准通用标记语言下的一个子集）的协议，它被设计成在WEB上交换结构化的和固化的信息。

​	webService三要素：SOAP、WSDL（Web Services Description Language）、UDDI（Universal Description Discoveryand Integration）。 WSDL 用来描述如何访问具体的接口， uddi用来管理，分发，查询webService 。具体实现可以搜索 Web Services简单实例 ; SOAP 可以和现存的许多因特网协议和格式结合使用，包括超文本传输协议（HTTP），简单邮件传输协议（SMTP），多用途网际邮件扩充协议（MIME）。它还支持从消息系统到远程过程调用（RPC）等大量的应用程序。SOAP使用基于XML的数据结构和超文本传输协议(HTTP)的组合定义了一个标准的方法来使用Internet上各种不同操作环境中的分布式对象。

## XML-RPC

​		XML-RPC是一个远程过程调用（远端程序呼叫）（remote procedure call，RPC)的分布式计算协议，通过XML将调用函数封装，并使用HTTP协议作为传送机制。

## REST

​	REST（Representational state transfer，表述性状态传递）是一种**软件架构风格**，目的是一种针对网络应用的设计和开发方式，可以降低开发的复杂性，提高系统的可伸缩性。一般使用**JSON作为数据格式**。

​	**设计规范：**1、客户服务器分离  2、无状态  3、可缓存  4、统一接口  5、分层的系统  6、服务器可将能力扩展到客服端（非必须）。

​	由于REST使用的人越来越多，因此开始需要规范来约束API，因此OpenAPI（原本swagger）、RAML和API Blueprint这些标准规范孕育而生。

## OPENAPI

​	由Linux基金会发起的一个接口规范项目，前身是swagger，受到了Google，IBM等公司的支持。

## RAML

​	由MuleSoft公司开发的一种接口规范。

## API Blueprint

​	由apiary公司开发的一种接口规范，该公司已经被Oracle公司收购。

## GraphQL

​	在很多人的印象中，它貌似是一种新的数据库，但其实叫它应该算作一种新的API类型，它为API提供另外一种查询语言，以及在服务器端用于执行查询命令的运行环境。

​	GraphQL是一种用来查询API的**查询语言**，以及一个用来运行查询语言的**服务端运行时**(runtime)。

​	GraphQL**并没有和任何特定数据库或者存储引擎绑定**，而是依靠开发者使用的代码和数据做支撑。

​	由Facebook开发，用来解决REST的短板。