from flask import Flask
from flask import jsonify
from flask import request
import boto3
import botocore
import os
from flask_cors import CORS
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

s3 = boto3.resource('s3')
s3_client = boto3.client('s3')


# Get all the list of bucket


# S3 implementation


@app.route('/', methods=['GET'])
def getBucketWithRegion():
    bucketWithRegion = []
    listOfBucket = []
    try:
        for bucket in s3.buckets.all():
            listOfBucket.append(bucket.name)
    except botocore.exceptions.ClientError as e:
        print(e)
    for bucket_name in listOfBucket:
        try:
            response = s3_client.get_bucket_location(Bucket=bucket_name)
            bucketWithRegion.append(
                {"Bucket": bucket_name, "Region": response['LocationConstraint']})
        except botocore.exceptions.ClientError as e:
            print(e)
    return jsonify({"buckets": bucketWithRegion})


@app.route('/getBucketInRegion', methods=['GET'])
def getBucketInRegion():
    bucketWithRegion = []
    region_name = request.args.get('region')
    listOfBucket = []
    try:
        for bucket in s3.buckets.all():
            listOfBucket.append(bucket.name)
    except botocore.exceptions.ClientError as e:
        print(e)
    for bucket_name in listOfBucket:
        try:
            response = s3_client.get_bucket_location(Bucket=bucket_name)
            bucketWithRegion.append(
                {"Bucket": bucket_name, "Region": response['LocationConstraint']})
        except botocore.exceptions.ClientError as e:
            print(e)
    finalList = [d for d in bucketWithRegion if d["Region"] == region_name]
    return jsonify({"buckets": finalList})


@app.route('/getObjects')
def getAllObject():
    # example Url example.com/getObjects?bName=123
    bucketName = request.args.get('bName')
    my_bucket = s3.Bucket(bucketName)
    listOfObject = []
    try:
        for file in my_bucket.objects.all():
            listOfObject.append({"Object": file.key})
        return jsonify({"objects": listOfObject})
    except botocore.exceptions.ClientError as e:
        print(e)


@app.route('/createBucket')
def createBucket():
    region_name = request.args.get('region')
    bucket_name = request.args.get('name')
    try:
        s3.create_bucket(Bucket=bucket_name, CreateBucketConfiguration={
                         'LocationConstraint': region_name})
        return jsonify({"Status": True})
    except botocore.exceptions.ClientError as e:
        print(e)


@app.route('/uploadObject', methods=['POST'])
def uploadObject():
    filePath = []
    content = request.json
    bucketName = content["bucket"]
    filePath = content["file"]
    object_name = content["name"]
    if object_name is None:
        object_name = os.path.basename(filePath)
    try:
        response = s3_client.upload_file(filePath, bucketName, object_name)
        return jsonify({"Status": "added"})
    except botocore.exceptions.ClientError as e:
        print(e)


@app.route('/deleteObject', methods=['DELETE'])
def deleteObject():
    content = request.json
    bucketName = content["bucket"]
    object = content["file"]
    bucket = s3.Bucket(bucketName)
    try:
        response = bucket.delete_objects(
            Delete={
                'Objects': [{'Key': file} for file in object]
            }
        )
        return jsonify({"Status": True})
    except botocore.exceptions.ClientError as e:
        print(e)


# EC2 implementation


ec2_resource = boto3.resource('ec2')
ec2_client = boto3.client('ec2')


@app.route('/getRegionEndpoint', methods=['GET'])
def getRegionEndpoint():
    regionEndpoint = []
    try:
        for region in ec2_client.describe_regions()['Regions']:
            regionEndpoint.append(region)
        return jsonify({"region": regionEndpoint})
    except botocore.exceptions.ClientError as e:
        print(e)


@app.route('/getImage', methods=['GET'])
def getImage():
    regionNames = []
    regionWithImage = []
    try:
        for region in ec2_client.describe_regions()['Regions']:
            regionNames.append(region["RegionName"])
        for regionName in regionNames:
            ec2_clientL = boto3.client('ec2', region_name=regionName)
            images = ec2_clientL.describe_images(Owners=['self'])
            newImageList = []
            for eachImage in images["Images"]:
                newImageList.append({
                    "Name": eachImage["Name"],
                    "id": eachImage["ImageId"]
                })
            regionWithImage.append({
                "region-name": regionName,
                "Image": newImageList
            })
        return jsonify({"data": regionWithImage})
    except botocore.exceptions.ClientError as e:
        print(e)


@app.route('/getAllInstances', methods=['GET'])
def getAllInstances():
    region = request.args.get('region')
    allInstance = []
    try:
        resourceL = boto3.resource('ec2', region_name=region)
        instances = resourceL.instances.filter()
        for inst in instances:
            name = ""
            groupName = ""
            if inst.tags:
                for eachName in inst.tags:
                    if "Key" in eachName and eachName["Key"] == "Name":
                        if "Value" in eachName:
                            name = eachName["Value"]
                        else:
                            name = inst.instance_id
                    else:
                        name = inst.instance_id
            else:
                name = inst.instance_id
            for eachSecuritygroup in inst.security_groups:
                groupName = eachSecuritygroup["GroupName"]

            allInstance.append({
                "Name": name,
                "tags": inst.tags,
                "Id": inst.instance_id,
                "imageid": inst.image_id,
                "Status": inst.state["Name"],
                "instancetype": inst.instance_type,
                "keypair": inst.key_name,
                "groupName": groupName,
                "securitygroup": inst.security_groups
            })
        return jsonify({"data": allInstance})
    except botocore.exceptions.ClientError as e:
        print(e)


@app.route('/getAllKeypair', methods=['GET'])
def getAllKeypair():
    region = request.args.get('region')
    try:
        client = boto3.client('ec2', region)
        keypairs = client.describe_key_pairs()
        return jsonify({"data": keypairs})
    except botocore.exceptions.ClientError as e:
        print(e)


@app.route('/getAllSecuritygroup', methods=['GET'])
def getAllSecuritygroup():
    try:
        client = boto3.client('ec2')
        securitygroup = client.describe_security_groups()
        return jsonify({"data": securitygroup["SecurityGroups"]})
    except botocore.exceptions.ClientError as e:
        print(e)


@app.route('/getAllInstancetype', methods=['GET'])
def getAllInstancetype():
    instancetype = []
    try:
        client = boto3.client('ec2')
        instancetypes = client.describe_instance_types()
        for i in instancetypes["InstanceTypes"]:
            instancetype.append({
                "InstanceType": i["InstanceType"]
            })
        return jsonify({"data": instancetype})
    except botocore.exceptions.ClientError as e:
        print(e)


@app.route('/startInstance', methods=['POST'])
def startInstance():
    content = request.json
    instances = content["instances"]
    try:
        response = ec2_client.start_instances(InstanceIds=instances)
        return jsonify({"status": response})
    except botocore.exceptions.ClientError as e:
        print(e)


@app.route('/stopInstance', methods=['POST'])
def stopInstance():
    content = request.json
    instances = content["instances"]
    try:
        response = ec2_client.stop_instances(InstanceIds=instances)
        return jsonify({"status": response})
    except botocore.exceptions.ClientError as e:
        print(e)


@app.route('/createInstance', methods=['POST'])
def createInstance():
    content = request.json
    client = boto3.client('ec2', content["region"])
    name = content["name"]
    imageid = content["imageid"]
    mincount = content["mincount"]
    maxcount = content["maxcount"]
    instancetype = content["instancetype"]
    keypair = content["keypair"]
    securitygroup = content["securitygroup"]
    try:
        instances = client.create_instances(
            ImageId=imageid,
            MinCount=mincount,
            MaxCount=maxcount,
            InstanceType=instancetype,
            KeyName=keypair,
            SecurityGroupIds=securitygroup,
            TagSpecifications=[
                {
                    'ResourceType': 'instance',
                    'Tags': [
                        {
                            'Key': 'Name',
                            'Value': name
                        },
                    ]
                },
            ],
        )

        return({"response": instances})
    except botocore.exceptions.ClientError as e:
        print(e)


@app.route('/cpuUtilization', methods=['GET'])
def cpuUtilization():
    id = request.args.get('id')
    try:
        client = boto3.client('cloudwatch')
        response = client.get_metric_statistics(
            Namespace='AWS/EC2',
            MetricName='CPUUtilization',
            Dimensions=[
                {
                    'Name': 'InstanceId',
                    'Value': id
                },
            ],
            StartTime=datetime.now() - timedelta(days=7),
            EndTime=datetime.now(),
            Period=86400,
            Statistics=[
                'Average',
            ],
            Unit='Percent'
        )
        return jsonify({"points": response})
    except botocore.exceptions.ClientError as e:
        print(e)


if __name__ == "__main__":
    app.run(debug=True)
