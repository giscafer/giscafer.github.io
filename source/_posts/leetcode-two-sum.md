title: 1.Two Sum
date: 2017-01-13 20:24:00
categories:
- 技术
- LeetCode
tags:
- leetcode
- 算法
toc: false
---


*原题地址：https://leetcode.com/problems/two-sum/*

>Given an array of integers, return indices of the two numbers such that they add up to a specific target.

>You may assume that each input would have exactly one solution.

>Example:
>Given nums = [2, 7, 11, 15], target = 9,

>Because nums[0] + nums[1] = 2 + 7 = 9,
>return [0, 1].

### 方法一

正常两次循环，循环次数可能多，只要数组不是很大，效率还是很高的

```javascript

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */

var twoSum = function(nums, target) {
	console.time('twoSum')
    for(var i=0;i<nums.length;i++){

    	for (var j = 0; j < nums.length&& i!=j; j++) {
    		if(nums[j]+nums[i]===target){
    			console.timeEnd('twoSum')
    			var result=[i,j].sort();
    			return result
    		}
    	};
    }
};

```
### 方法二

边循环边使用对象存储

```javascript

var twoSum2 = function(nums, target) {
	console.time('twoSum2')
	var obj={};

    for(var i=0;i<nums.length;i++){
    	if(obj[nums[i+'']]!==null && obj[nums[i+'']]!==undefined){
    		var result=[obj[nums[i]],i];
    		 console.timeEnd('twoSum2')
    		return result;
    	}
    	obj[target-nums[i]]=i;
    }

    var result2=[];
    return result2;
};


```

测试结果，建议使用更大的数组测试，才会看到`twoSum2`方法效率高

```
var nums = [2, 7, 11, 15], target = 9;
// var nums = [11, 15, 9,1,1,3,1,11, 15, 9,1,1,3,1,1,1,1,1,2,7,3], target = 9;
twoSum(nums,target);
twoSum2(nums,target);
```

经测试，在小数组时，`twoSum方法`比`twoSum2`快很多，当数组变大时，`twoSum2`算法更快

