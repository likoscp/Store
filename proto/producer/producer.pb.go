// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.36.6
// 	protoc        v6.30.2
// source: producer.proto

package producerpb

import (
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	reflect "reflect"
	sync "sync"
	unsafe "unsafe"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

type OrderItem struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	ProductId     string                 `protobuf:"bytes,1,opt,name=product_id,json=productId,proto3" json:"product_id,omitempty"`
	Quantity      int32                  `protobuf:"varint,2,opt,name=quantity,proto3" json:"quantity,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *OrderItem) Reset() {
	*x = OrderItem{}
	mi := &file_producer_proto_msgTypes[0]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *OrderItem) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*OrderItem) ProtoMessage() {}

func (x *OrderItem) ProtoReflect() protoreflect.Message {
	mi := &file_producer_proto_msgTypes[0]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use OrderItem.ProtoReflect.Descriptor instead.
func (*OrderItem) Descriptor() ([]byte, []int) {
	return file_producer_proto_rawDescGZIP(), []int{0}
}

func (x *OrderItem) GetProductId() string {
	if x != nil {
		return x.ProductId
	}
	return ""
}

func (x *OrderItem) GetQuantity() int32 {
	if x != nil {
		return x.Quantity
	}
	return 0
}

type OrderCreated struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Id            string                 `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	UserId        string                 `protobuf:"bytes,2,opt,name=user_id,json=userId,proto3" json:"user_id,omitempty"`
	Items         []*OrderItem           `protobuf:"bytes,3,rep,name=items,proto3" json:"items,omitempty"`
	TotalPrice    float64                `protobuf:"fixed64,4,opt,name=total_price,json=totalPrice,proto3" json:"total_price,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *OrderCreated) Reset() {
	*x = OrderCreated{}
	mi := &file_producer_proto_msgTypes[1]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *OrderCreated) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*OrderCreated) ProtoMessage() {}

func (x *OrderCreated) ProtoReflect() protoreflect.Message {
	mi := &file_producer_proto_msgTypes[1]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use OrderCreated.ProtoReflect.Descriptor instead.
func (*OrderCreated) Descriptor() ([]byte, []int) {
	return file_producer_proto_rawDescGZIP(), []int{1}
}

func (x *OrderCreated) GetId() string {
	if x != nil {
		return x.Id
	}
	return ""
}

func (x *OrderCreated) GetUserId() string {
	if x != nil {
		return x.UserId
	}
	return ""
}

func (x *OrderCreated) GetItems() []*OrderItem {
	if x != nil {
		return x.Items
	}
	return nil
}

func (x *OrderCreated) GetTotalPrice() float64 {
	if x != nil {
		return x.TotalPrice
	}
	return 0
}

type Empty struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *Empty) Reset() {
	*x = Empty{}
	mi := &file_producer_proto_msgTypes[2]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *Empty) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Empty) ProtoMessage() {}

func (x *Empty) ProtoReflect() protoreflect.Message {
	mi := &file_producer_proto_msgTypes[2]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Empty.ProtoReflect.Descriptor instead.
func (*Empty) Descriptor() ([]byte, []int) {
	return file_producer_proto_rawDescGZIP(), []int{2}
}

var File_producer_proto protoreflect.FileDescriptor

const file_producer_proto_rawDesc = "" +
	"\n" +
	"\x0eproducer.proto\x12\x05proto\"F\n" +
	"\tOrderItem\x12\x1d\n" +
	"\n" +
	"product_id\x18\x01 \x01(\tR\tproductId\x12\x1a\n" +
	"\bquantity\x18\x02 \x01(\x05R\bquantity\"\x80\x01\n" +
	"\fOrderCreated\x12\x0e\n" +
	"\x02id\x18\x01 \x01(\tR\x02id\x12\x17\n" +
	"\auser_id\x18\x02 \x01(\tR\x06userId\x12&\n" +
	"\x05items\x18\x03 \x03(\v2\x10.proto.OrderItemR\x05items\x12\x1f\n" +
	"\vtotal_price\x18\x04 \x01(\x01R\n" +
	"totalPrice\"\a\n" +
	"\x05Empty2K\n" +
	"\x0fProducerService\x128\n" +
	"\x13PublishOrderCreated\x12\x13.proto.OrderCreated\x1a\f.proto.EmptyB\x16Z\x14/producer;producerpbb\x06proto3"

var (
	file_producer_proto_rawDescOnce sync.Once
	file_producer_proto_rawDescData []byte
)

func file_producer_proto_rawDescGZIP() []byte {
	file_producer_proto_rawDescOnce.Do(func() {
		file_producer_proto_rawDescData = protoimpl.X.CompressGZIP(unsafe.Slice(unsafe.StringData(file_producer_proto_rawDesc), len(file_producer_proto_rawDesc)))
	})
	return file_producer_proto_rawDescData
}

var file_producer_proto_msgTypes = make([]protoimpl.MessageInfo, 3)
var file_producer_proto_goTypes = []any{
	(*OrderItem)(nil),    // 0: proto.OrderItem
	(*OrderCreated)(nil), // 1: proto.OrderCreated
	(*Empty)(nil),        // 2: proto.Empty
}
var file_producer_proto_depIdxs = []int32{
	0, // 0: proto.OrderCreated.items:type_name -> proto.OrderItem
	1, // 1: proto.ProducerService.PublishOrderCreated:input_type -> proto.OrderCreated
	2, // 2: proto.ProducerService.PublishOrderCreated:output_type -> proto.Empty
	2, // [2:3] is the sub-list for method output_type
	1, // [1:2] is the sub-list for method input_type
	1, // [1:1] is the sub-list for extension type_name
	1, // [1:1] is the sub-list for extension extendee
	0, // [0:1] is the sub-list for field type_name
}

func init() { file_producer_proto_init() }
func file_producer_proto_init() {
	if File_producer_proto != nil {
		return
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: unsafe.Slice(unsafe.StringData(file_producer_proto_rawDesc), len(file_producer_proto_rawDesc)),
			NumEnums:      0,
			NumMessages:   3,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_producer_proto_goTypes,
		DependencyIndexes: file_producer_proto_depIdxs,
		MessageInfos:      file_producer_proto_msgTypes,
	}.Build()
	File_producer_proto = out.File
	file_producer_proto_goTypes = nil
	file_producer_proto_depIdxs = nil
}
