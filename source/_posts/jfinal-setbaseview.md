title: jfinal-setbaseview
date: 2015-10-30 21:49:31
categories:
- JFinal
tags:
- JFinal
---

## 一、路由路径规则

 > 1：模板路径= BaseViewPath + ViewPath + render时的参数

 > 2：当 render 时view的参数以 "/" 打头，则模板路径使用从WebRoot下的绝对路
 
 > 3：在配置路由时如果省略第三个参数，则 viewPath = controllerKey

<!--more-->

在JFinalConfig的`configConstant`方法中设置/WEB-INF/views/为基础路径；
`me.setBaseViewPath("/WEB-INF/views/")`；

设定后，路由configRoute内的视图路径就会直接找`/WEB-INF/views/`下的文件，Controller里边render 时view的参数不能以 "/" 打头，不然就是直接是找WebRoot下的绝对路径。


    <filter>
		<filter-name>jfinal</filter-name>
		<filter-class>com.jfinal.core.JFinalFilter</filter-class>
		<init-param>
			<param-name>configClass</param-name>
			<param-value>com.giscafer.schedule.config.ScheduleConfig</param-value>
		</init-param>
	</filter>

	<filter-mapping>
		<filter-name>jfinal</filter-name>
		<url-pattern>/*</url-pattern><!--此处如果不是/*的话，路由会失效-->
	</filter-mapping>


## JFinal 过滤器拦截Servlet解决方法

JFinal配置的过滤器（如上过滤器配置）会拦截掉Servlet请求，这个时候可以通过配置路由处理器来解决：

    /**
	 * 配置处理器
	 */
	public void configHandler(Handlers me) {
		//使用此方式跳过jfinal过滤器对servlet的拦截
		me.add(new UrlSkipHandler("/home", false));
	}

这样，`/home`路径的servlet就不会被jfinal的过滤器拦截了。这是最方便的解决方式。