title: GeoTools使用之JTSFactoryFinder接口demo
date: 2015-09-09 13:07:04
categories: GeoTools
tags: GeoTools
---

依赖jar文件为`gt-opengis-8.0-M0.jar`、`jsr-275-1.0-beta-2.jar`更高版本不限定

<!-- more -->

```java
package com.giscafer.geometry;

import java.util.ArrayList;
import java.util.List;

import org.geotools.factory.Hints;
import org.geotools.geometry.GeneralDirectPosition;
import org.geotools.geometry.jts.JTSFactoryFinder;
import org.geotools.referencing.ReferencingFactoryFinder;
import org.opengis.geometry.DirectPosition;
import org.opengis.geometry.MismatchedDimensionException;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.crs.CRSFactory;
import org.opengis.referencing.crs.CoordinateReferenceSystem;
import org.opengis.referencing.operation.CoordinateOperation;
import org.opengis.referencing.operation.CoordinateOperationFactory;
import org.opengis.referencing.operation.MathTransform;
import org.opengis.referencing.operation.TransformException;

import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jts.geom.GeometryFactory;
import com.vividsolutions.jts.geom.LineString;
import com.vividsolutions.jts.geom.LinearRing;
import com.vividsolutions.jts.geom.Point;
import com.vividsolutions.jts.geom.Polygon;
import com.vividsolutions.jts.io.ParseException;
import com.vividsolutions.jts.io.WKTReader;

public class GeometryUtil {
	private static GeometryFactory geometryFactory = JTSFactoryFinder.getGeometryFactory( null ); 
	private static CRSFactory crsFactory = ReferencingFactoryFinder.getCRSFactory(null); 
	//WGS2000经纬度坐标系
	private static String GCS_China_2000 = "GEOGCS[\"GCS_China_Geodetic_Coordinate_System_2000\",DATUM[\"D_China_2000\",SPHEROID[\"CGCS2000\",6378137.0,298.257222101]],PRIMEM[\"Greenwich\",0.0],UNIT[\"Degree\",0.0174532925199433]]";
    //墨卡托平面坐标系，用距离计算、面积计算
	private static String Mercator_XY_WKT = "PROJCS[\"WGS_1984_Web_Mercator\",GEOGCS[\"GCS_WGS_1984_Major_Auxiliary_Sphere\",DATUM[\"D_WGS_1984_Major_Auxiliary_Sphere\",SPHEROID[\"WGS_1984_Major_Auxiliary_Sphere\",6378137.0,0.0]],PRIMEM[\"Greenwich\",0.0],UNIT[\"Degree\",0.0174532925199433]],PROJECTION[\"Mercator\"],PARAMETER[\"False_Easting\",0.0],PARAMETER[\"False_Northing\",0.0],PARAMETER[\"Central_Meridian\",0.0],PARAMETER[\"Standard_Parallel_1\",0.0],UNIT[\"Meter\",1.0]]";
	//坐标转换对象
	
	/** 
     * create a Point 
     * @param x 
     * @param y 
     * @return 
     */  
    public static Coordinate createPoint(double x,double y){ 
        return new Coordinate(x,y);  
    } 
    /**
	 * create a point
	 * @return Geometry
	 */
	public static Point createGeoPoint(double x,double y){
		Coordinate coord = new Coordinate(x, y);
		Point point = geometryFactory.createPoint( coord );
		return point;
	}
    /**
     * 通过读取WKT字符串创建空间对象 
     * @param geomWKT
     * @return
     * @throws ParseException
     */
    public Geometry createPointByWKT(String geomWKT) throws ParseException{  
        WKTReader reader = new WKTReader( geometryFactory );  
        Geometry geom =reader.read(geomWKT);  
        return geom;  
    }  
      
  
    /** 
     * create a line 
     * @return 
     */  
    public static LineString createLine(List<Coordinate> points){
    	if(points.size()<2){
    		points.add(points.get(0));
    	}
        Coordinate[] coords  = (Coordinate[]) points.toArray(new Coordinate[points.size()]);  
        LineString line = geometryFactory.createLineString(coords);  
        return line;  
    }
    
    /**
     * 根据点串创建多边形
     * @param points
     * @return
     */
    public static Polygon createPolygon(List<Coordinate> points){
    	Coordinate[] coords  = (Coordinate[]) points.toArray(new Coordinate[points.size()]);  
    	Polygon polygon=geometryFactory.createPolygon(coords);
    	return polygon;
    }
      
    /** 
     * 返回(A)与(B)中距离最近的两个点的距离 
     * @param a 
     * @param b 
     * @return 
     */  
    public static double distanceGeo(Geometry a,Geometry b){  
        return a.distance(b);  
    }  
      
    /** 
     * 两个几何对象的交集 
     * @param a 
     * @param b 
     * @return 
     */  
    public static Geometry intersectionGeo(Geometry a,Geometry b){  
        return a.intersection(b);  
    }  
      
    /** 
     * 几何对象合并 
     * @param a 
     * @param b 
     * @return 
     */  
    public static Geometry unionGeo(Geometry a,Geometry b){  
        return a.union(b);  
    }  
      
    /** 
     * 在A几何对象中有的，但是B几何对象中没有 
     * @param a 
     * @param b 
     * @return 
     */  
    public static Geometry differenceGeo(Geometry a,Geometry b){  
        return a.difference(b);  
    } 
    
    /**
     * 获取线的长度，默认坐标为：坐标值为北京2000坐标系
     * @param line
     * @return
     * @throws TransformException 
     * @throws FactoryException 
     * @throws MismatchedDimensionException 
     */
    public static double getLengthLonLat(LineString line) throws MismatchedDimensionException, FactoryException, TransformException{
    	Coordinate []points=line.getCoordinates();
    	List<Coordinate> pointsList=new ArrayList<Coordinate>();
    	for(int i=0;i<points.length;i++){
    		Coordinate point=lonLatToXY(points[i]);
    		pointsList.add(point);
    	}
    	LineString lineXY=createLine(pointsList);
    	return lineXY.getLength();
    }
    
    /**
     * 获取线的长度，默认坐标为平面坐标系
     * @param line
     * @return
     */
    public static double getLengthXY(LineString line){
    	return line.getLength();
    }
    
    /**
     * 获取多边形面积，输入坐标系为北京2000经纬度坐标系
     * @param polygon
     * @return
     * @throws MismatchedDimensionException
     * @throws FactoryException
     * @throws TransformException
     */
    public static double getAreaLonLat(Polygon polygon) throws MismatchedDimensionException, FactoryException, TransformException{
    	Coordinate []points=polygon.getCoordinates();
    	List<Coordinate> pointsList=new ArrayList<Coordinate>();
    	for(int i=0;i<points.length;i++){
    		Coordinate point=lonLatToXY(points[i]);
    		pointsList.add(point);
    	}
    	Polygon lineXY=createPolygon(pointsList);
    	return lineXY.getArea();
    }
    
    /**
   	 * create a Circle  创建一个圆，圆心(x,y) 半径RADIUS
   	 * @param x
   	 * @param y
   	 * @param RADIUS 单位（米）
   	 * @return
   	 */
   	public static Polygon createCircle(double x, double y, final double RADIUS){
   		final int SIDES = 32;//圆上面的点个数
   		//距离转度
   		double degree = RADIUS / (2 * Math.PI * 6378137.0) * 360;
//   		System.out.println("度："+degree);
   	    Coordinate coords[] = new Coordinate[SIDES+1];
   	    for( int i = 0; i < SIDES; i++){
   	        double angle = ((double) i / (double) SIDES) * Math.PI * 2.0;
   	        double dx = Math.cos( angle ) * degree;
   	        double dy = Math.sin( angle ) * degree;
   	        coords[i] = new Coordinate( (double) x + dx, (double) y + dy );
   	    }
   	    coords[SIDES] = coords[0];
   	    LinearRing ring = geometryFactory.createLinearRing( coords );
   	    Polygon polygon = geometryFactory.createPolygon( ring, null );
   	    return polygon;
   	}
    
    
    /**
     * 将经纬度的点坐标转换为平面坐标
     * @param point
     * @return
     * @throws FactoryException 
     * @throws TransformException 
     * @throws MismatchedDimensionException 
     */
    public static Coordinate lonLatToXY(Coordinate coordinate) throws FactoryException, MismatchedDimensionException, TransformException{
    	Hints hint = new Hints(Hints.LENIENT_DATUM_SHIFT, true);
    	CoordinateReferenceSystem sourceCRS = crsFactory.createFromWKT(GCS_China_2000);
        CoordinateReferenceSystem targetCRS = crsFactory.createFromWKT(Mercator_XY_WKT);
    	CoordinateOperationFactory coFactory = ReferencingFactoryFinder.getCoordinateOperationFactory(hint);
        CoordinateOperation co = coFactory.createOperation(sourceCRS,targetCRS);
        MathTransform transform = co.getMathTransform();
        double x = coordinate.x;
    	double y = coordinate.y;
    	DirectPosition point = new GeneralDirectPosition(x, y);
    	point = transform.transform(point, point);
    	double lat = point.getOrdinate(0);
    	double lon = point.getOrdinate(1);
    	return createPoint(lat,lon);
    }
    
    /**
	 * @param args
	 * @throws FactoryException 
	 * @throws TransformException 
	 * @throws MismatchedDimensionException 
	 */
	public static void main(String[] args) throws FactoryException, MismatchedDimensionException, TransformException {
		// TODO Auto-generated method stub
		Coordinate point1=GeometryUtil.createPoint(116.252189, 39.9065632);
		Coordinate point2=GeometryUtil.createPoint(116.251977, 39.9068492);
		Coordinate point3=GeometryUtil.createPoint(116.252168, 39.9065392);
		Coordinate point4=GeometryUtil.createPoint(116.255095, 39.9066112);
		List<Coordinate> points=new ArrayList<Coordinate>();
		List<Coordinate> points1=new ArrayList<Coordinate>();
		points.add(point1);
		points.add(point2);
		points.add(point3);
		points.add(point4);
		points.add(point1);
		points1.add(point1);
        //创建面
		Polygon polygon=GeometryUtil.createPolygon(points);
		//创建线
		LineString line1=GeometryUtil.createLine(points1);
		LineString line =GeometryUtil.createLine(points);
		//获取面积和长度
		System.out.println("line-changdu-lonlat:"+line.getLength());
		System.out.println("line-changdu-xy:"+GeometryUtil.getLengthLonLat(line));
		System.out.println("polygon-mianji-lonlat:"+polygon.getArea());
		System.out.println("line-changdu-xy:"+GeometryUtil.getAreaLonLat(polygon));
		System.out.println("toString()---"+line.toString());
		System.out.println("toString()---"+line1.toString());
		//判断某个点是否在圆内
		Polygon p = GeometryUtil.createCircle(116.1851444, 39.9269055, 200000);
		Point point=GeometryUtil.createPoint(119.185144, 39.9269);
		Boolean isOk=p.contains(point);
		System.out.println(isOk);
	}

}
```

**另外接口还包含很多关于对空间图形计算的：**

相等(Equals)：几何形状拓扑上相等。
脱节(Disjoint)：几何形状没有共有的点。
相交(Intersects)：几何形状至少有一个共有点（区别于脱节）
接触(Touches)：几何形状有至少一个公共的边界点，但是没有内部点。
交叉(Crosses)：几何形状共享一些但不是所有的内部点。
内含(Within)：几何形状A的线都在几何形状B内部。
包含(Contains)：几何形状B的线都在几何形状A内部（区别于内含）
重叠(Overlaps)：几何形状共享一部分但不是所有的公共点，而且相交处有他们自己相同的区域。


