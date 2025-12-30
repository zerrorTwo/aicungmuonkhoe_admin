import {
  Button as ButtonAnt,
  Col,
  Divider,
  Empty,
  Form,
  FormProps,
  InputNumber,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Spin,
  Tabs,
  TabsProps,
  Tooltip,
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { css } from "@emotion/react";
import ReactQuill from "react-quill";
import { Button } from "@/components/button";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import {
  ConclusionRecommendationKey,
  ConclusionRecommendationAgeKey,
} from "@/enums/conclusion-recommendation-key";
import { useConclusionData } from "@/hooks/use-conclusion-data";
import { useConclusionDropdown } from "@/hooks/use-conclusion-dropdown";
import {
  useBulkUpdateConclusionRecommendationsMutation,
  useDeleteConclusionRecommendationMutation,
} from "@/redux/services/healthApi";
import {
  isKeyGenderRelated,
  isShowBMIIndiCatorRelated,
} from "@/helpers/conclusion-recommendation.helper";
import { isKeyAgeRelated } from "@/helpers/conclusion-recommendation.helper";
import { valueSelectedModelOne } from "@/helpers/conclusion-recommendation.helper";
import { valueSelectedModelTwo } from "@/helpers/conclusion-recommendation.helper";
import { bloodPressureInput } from "@/helpers/conclusion-recommendation.helper";
import {
  isIndicatorOne,
  isIndicatorTwo,
  optionAgeType,
} from "@/helpers/conclusion-recommendation.helper";
import { excludeOptionAgeRelated } from "@/helpers/conclusion-recommendation.helper";
import { notShowAge } from "@/helpers/conclusion-recommendation.helper";
import usePermission from "../../hooks/permission.hook";
import { useBeforeUnload } from "react-router-dom";

type ConclusionRecommendationFormProps = {
  selectedKey: string;
};

interface FormData extends BaseFields {
  id: number;
  dbId?: number; // ID từ database để xóa
  isEditable: boolean;
}

type FieldType = Partial<BaseFields> & { [key: string]: any };

interface BaseFields {
  age?: string;
  SBP?: string;
  SBPOperator?: string;
  SBPStart?: number;
  SBPEnd?: number;
  DBP?: string;
  DBPOperator?: string;
  DBPStart?: number;
  DBPEnd?: number;
  classification?: string;
  conclusion?: string;
  recommendation?: string;
  radioSelection?: string;
  gender?: string;
}

export const ConclusionRecommendationForm = ({
  selectedKey = ConclusionRecommendationKey.BloodPressureClinic,
}: ConclusionRecommendationFormProps) => {
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "link",
    "blockquote",
    "list",
    "bullet",
    "color",
    "background",
  ];

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline"],
      ["link"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
  };

  const [form] = Form.useForm();
  const [formData, setFormData] = useState<FormData[]>([]);
  const [model, setModel] = useState("HOSPITAL");
  const [ageModel, setAgeModel] = useState("FROM_5_LESS_THAN_12");
  const [gender, setGender] = useState("nam");
  const [ageType, setAgeType] = useState("FROM_5_LESS_THAN_12");

  // Calculate showAge and showGender first
  let showAge = useMemo(
    () => isKeyAgeRelated(selectedKey as ConclusionRecommendationKey),
    [selectedKey]
  );
  const showGender = useMemo(
    () => isKeyGenderRelated(selectedKey as ConclusionRecommendationKey),
    [selectedKey]
  );

  // Use custom hooks for data fetching with ageType and gender
  const { conclusionRecommendationList, loading } = useConclusionData(
    selectedKey,
    showAge ? ageType : undefined,
    showGender ? gender : undefined
  );
  const conclusionDropdowns = useConclusionDropdown();
  const [bulkUpdate] = useBulkUpdateConclusionRecommendationsMutation();
  const [deleteConclusion] = useDeleteConclusionRecommendationMutation();
  const { creatable, updatable, deletable } = usePermission();

  const [typeOptions, setTypeOptions] = useState<any>([]);
  const [itemFollowAges, setItemFollowAges] = useState<any>([]);
  const [operatorsOptions, setOperatorsOptions] = useState<any>([]);
  const [ageOptions, setAgeOptions] = useState<any>([]);
  const [sbpOperatorValues, setSbpOperatorValues] = useState<
    Record<string, string>
  >({});
  const [dbpOperatorValues, setDbpOperatorValues] = useState<
    Record<string, string>
  >({});

  const items: TabsProps["items"] = useMemo(() => {
    if (
      ageModel === "FROM_20_LESS_THEN_70" ||
      ageModel === "EQUAL_MORE_THAN_70"
    ) {
      setGender("nam");
      return [];
    }
    return [
      {
        key: "nam",
        label: "Đối với nam",
      },
      {
        key: "nu",
        label: "Đối với nữ",
      },
    ];
  }, [ageModel]);
  const bloodPressureLabelOne = useMemo(
    () => valueSelectedModelOne(selectedKey as ConclusionRecommendationKey),
    [selectedKey]
  );
  const bloodPressureLabelTwo = useMemo(
    () => valueSelectedModelTwo(selectedKey as ConclusionRecommendationKey),
    [selectedKey]
  );

  const fetchData = useCallback(() => {
    // Set model based on selected key
    // Data fetching is handled automatically by useConclusionData hook
    switch (selectedKey) {
      case ConclusionRecommendationKey.BloodPressureClinic:
        setModel("HOSPITAL");
        break;
      case ConclusionRecommendationKey.BloodPressureHome:
        setModel("HOME");
        break;
      case ConclusionRecommendationKey.BloodSugarFasting:
        setModel("HUNGRY");
        break;
      case ConclusionRecommendationKey.BloodSugar2H:
        setModel("2_HOURS");
        break;
      case ConclusionRecommendationKey.BloodSugarHbA1c:
        setModel("HBA1C");
        break;
      case ConclusionRecommendationKey.LiverEnzymeSgot:
        setModel("SGOT");
        break;
      case ConclusionRecommendationKey.LiverEnzymeSgpt:
        setModel("SGPT");
        break;
      case ConclusionRecommendationKey.LipidCholesterol:
        setModel("CHOL");
        break;
      case ConclusionRecommendationKey.LipidLdl:
        setModel("LDL");
        break;
      case ConclusionRecommendationKey.LipidHdl:
        setModel("HDL");
        break;
      case ConclusionRecommendationKey.LipidTriglyceride:
        setModel("TRI");
        break;
      case ConclusionRecommendationKey.Urea:
        setModel("URE");
        break;
      case ConclusionRecommendationKey.Creatinine:
        setModel("CREA");
        break;
      case ConclusionRecommendationKey.UricAcid:
        setModel("AXIT_URIC");
        break;
      case ConclusionRecommendationKey.BMI:
        setModel("BMI");
        break;
      case ConclusionRecommendationKey.HeightLength:
        setModel("HEIGHT");
        break;
      case ConclusionRecommendationKey.Weight:
        setModel("WEIGHT");
        break;
      default:
        setModel("HOSPITAL");
        break;
    }

    // Process dropdown options
    const isBMI =
      isKeyAgeRelated(selectedKey as ConclusionRecommendationKey) &&
      isShowBMIIndiCatorRelated(ageModel);
    setTypeOptions(
      conclusionDropdowns
        .filter((item) => item.type === (isBMI ? "TYPE_1" : "TYPE"))
        .map((item) => ({
          key: item.code,
          label: item.name,
          value: item.code,
        }))
    );
    setItemFollowAges(
      conclusionDropdowns
        .filter((item) => item.type === "AGE_TYPE")
        .map((item) => ({
          key: item.code,
          label: item.name,
          value: item.code,
        }))
    );
    setOperatorsOptions(
      conclusionDropdowns
        .filter((item) => item.type === "INDICATOR")
        .map((item) => ({
          key: item.code,
          label: item.name,
          value: item.code,
        }))
    );
    setAgeOptions(
      conclusionDropdowns
        .filter((item) => item.type === "AGE_TYPE")
        .map((item) => ({
          label: item.name,
          value: item.code,
        }))
    );
  }, [conclusionDropdowns, selectedKey, gender, ageModel]);

  const handleAgeTypeChange = (key: string) => {
    setAgeType(key);
    setAgeModel(key);
  };

  const handleAddEntry = () => {
    const currentValues = form.getFieldsValue();

    setFormData((prevData) =>
      prevData.map((item) => ({
        ...item,
        age: currentValues[`age[${item.id}]`],
        SBPOperator: currentValues[`SBPOperator[${item.id}]`],
        SBPStart: currentValues[`SBPStart[${item.id}]`],
        SBPEnd: currentValues[`SBPEnd[${item.id}]`],
        DBPOperator: currentValues[`DBPOperator[${item.id}]`],
        DBPStart: currentValues[`DBPStart[${item.id}]`],
        DBPEnd: currentValues[`DBPEnd[${item.id}]`],
        classification: currentValues[`classification[${item.id}]`],
        conclusion: currentValues[`conclusion[${item.id}]`],
        recommendation: currentValues[`recommendation[${item.id}]`],
        radioSelection: currentValues[`radioSelection[${item.id}]`],
      }))
    );

    setFormData((prevData) => [
      { id: 1, isEditable: true },
      ...prevData.map((item) => ({ ...item, id: item.id + 1 })),
    ]);
  };

  const handleEdit = (id: number) => {
    setFormData((prevData) =>
      prevData.map((data) =>
        data.id === id ? { ...data, isEditable: true } : data
      )
    );
  };

  const handleCancel = () => {
    // Xóa các items mới chưa lưu (không có dbId) và reset các items đang edit
    setFormData(
      (prevData) =>
        prevData
          .filter((item) => item.dbId) // Chỉ giữ lại items đã lưu trong DB
          .map((item) => ({ ...item, isEditable: false })) // Đặt tất cả về chế độ xem
    );
    // Reset form về giá trị ban đầu
    form.resetFields();
  };

  const handleDbpOperator = (id: number, value: string) => {
    setDbpOperatorValues((prev) => ({
      ...prev,
      [`DBPOperator[${id}]`]: value,
    }));
    form.setFieldValue(`DBPStart[${id}]`, "");
    form.setFieldValue(`DBPEnd[${id}]`, "");
  };

  const handleSbpOperator = (id: number, value: string) => {
    setSbpOperatorValues((prev) => ({
      ...prev,
      [`SBPOperator[${id}]`]: value,
    }));
    form.setFieldValue(`SBPStart[${id}]`, "");
    form.setFieldValue(`SBPEnd[${id}]`, "");
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    let newAgeType = ageType;
    if (model === "WEIGHT") {
      showAge = true;
      newAgeType = "FROM_0_LESS_THAN_5";
    }

    // Chỉ lấy những item đang editable (item mới hoặc đang chỉnh sửa)
    const editableItems = formData.filter((data) => data.isEditable);

    // Kiểm tra nếu không có item nào để lưu
    if (editableItems.length === 0) {
      message.warning("Không có dữ liệu mới để lưu!");
      return;
    }

    // Format items theo đúng structure của BE (uppercase fields)
    const formattedItems = editableItems.map((data) => ({
      MODEL: model,
      AGE_TYPE: showAge ? newAgeType : values[`age[${data.id}]`],
      INDICATOR_FROM: values[`SBPOperator[${data.id}]`],
      VALUE_FROM: values[`SBPStart[${data.id}]`],
      VALUE_TO: values[`SBPEnd[${data.id}]`],
      INDICATOR_TO: values[`DBPOperator[${data.id}]`],
      VALUE_ONE_FROM: values[`DBPStart[${data.id}]`],
      VALUE_ONE_TO: values[`DBPEnd[${data.id}]`],
      TYPE: values[`classification[${data.id}]`],
      CONCLUSION: values[`conclusion[${data.id}]`],
      RECOMMEND: values[`recommendation[${data.id}]`],
      INDICATOR_AND: values[`radioSelection[${data.id}]`],
      GENDER: showGender ? gender : undefined,
    }));

    try {
      // Payload structure theo BulkCreateConclusionDto
      const payload: any = {
        model: model,
        items: formattedItems, // Chỉ gửi items đang editable
      };

      // Thêm gender và ageType ở root level nếu cần
      if (model === "BMI") {
        if (
          ageType === "EQUAL_MORE_THAN_70" ||
          ageType === "FROM_20_LESS_THEN_70"
        ) {
          payload.ageType = showAge ? newAgeType : undefined;
        } else {
          payload.gender = showGender ? gender : undefined;
          payload.ageType = showAge ? newAgeType : undefined;
        }
      } else {
        payload.gender = showGender ? gender : undefined;
        payload.ageType = showAge ? newAgeType : undefined;
      }

      await bulkUpdate(payload).unwrap();
      message.success("Cập nhật thành công!");
      // Refresh data sau khi cập nhật
      fetchData();
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật!");
      console.error("Update error:", error);
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  const handleDelete = async (id: number) => {
    // Tìm item trong formData để lấy dbId
    const itemToDelete = formData.find((data) => data.id === id);

    Modal.confirm({
      title: "Xóa Kết luận và Khuyến nghị",
      content: (
        <em>
          Bạn có chắc chắn muốn xóa kết luận và khuyến nghị này không? <br />
          Thông tin đã xóa sẽ không thể lấy lại được.
        </em>
      ),
      okText: "Xác nhận",
      width: 500,
      cancelText: "Hủy",
      onOk: async () => {
        try {
          // Nếu có dbId (item đã lưu trong DB), gọi API xóa
          if (itemToDelete?.dbId) {
            await deleteConclusion(itemToDelete.dbId).unwrap();
            message.success("Xóa thành công!");
            // Refresh data sau khi xóa
            fetchData();
          } else {
            // Nếu không có dbId (item mới chưa lưu), chỉ xóa khỏi local state
            setFormData((prevData) =>
              prevData.filter((data) => data.id !== id)
            );
            message.success("Đã xóa khỏi danh sách!");
          }
        } catch (error) {
          message.error("Có lỗi xảy ra khi xóa!");
          console.error("Delete error:", error);
        }
      },
    });
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const formValues: Record<string, any> = formData.reduce((acc, curr) => {
      acc[`age[${curr.id}]`] = curr.age;
      acc[`SBPOperator[${curr.id}]`] = curr.SBPOperator;
      acc[`SBPStart[${curr.id}]`] = curr.SBPStart;
      acc[`SBPEnd[${curr.id}]`] = curr.SBPEnd;
      acc[`DBPOperator[${curr.id}]`] = curr.DBPOperator;
      acc[`DBPStart[${curr.id}]`] = curr.DBPStart;
      acc[`DBPEnd[${curr.id}]`] = curr.DBPEnd;
      acc[`classification[${curr.id}]`] = curr.classification;
      acc[`conclusion[${curr.id}]`] = curr.conclusion;
      acc[`recommendation[${curr.id}]`] = curr.recommendation;
      acc[`radioSelection[${curr.id}]`] = curr.radioSelection;
      return acc;
    }, {} as Record<string, any>);

    form.setFieldsValue(formValues);

    const newSbpOperatorValues = formData.reduce((acc, curr) => {
      acc[`SBPOperator[${curr.id}]`] = curr.SBPOperator ?? "";
      return acc;
    }, {} as Record<string, string>);

    setSbpOperatorValues(newSbpOperatorValues);

    const newDbpOperatorValues = formData.reduce((acc, curr) => {
      acc[`DBPOperator[${curr.id}]`] = curr.DBPOperator ?? "";
      return acc;
    }, {} as Record<string, string>);

    setDbpOperatorValues(newDbpOperatorValues);
  }, [form, formData]);

  useEffect(() => {
    setFormData(
      conclusionRecommendationList.map((val, index) => ({
        id: index + 1,
        dbId: val.ID || val.id, // Lưu ID từ DB để dùng khi xóa
        age: val.AGE_TYPE || val.ageType,
        SBPOperator: val.INDICATOR_FROM || val.indicatorFrom,
        SBPStart: val.VALUE_FROM || val.valueFrom,
        SBPEnd: val.VALUE_TO || val.valueTo,
        DBPOperator: val.INDICATOR_TO || val.indicatorTo,
        DBPStart: val.VALUE_ONE_FROM || val.valueOneFrom,
        DBPEnd: val.VALUE_ONE_TO || val.valueOneTo,
        classification: val.TYPE || val.type,
        conclusion: val.CONCLUSION || val.conclusion,
        recommendation: val.RECOMMEND || val.recommend,
        radioSelection: val.INDICATOR_AND || val.indicatorAnd,
        isEditable: false,
      }))
    );
  }, [conclusionRecommendationList]);

  useBeforeUnload((e) => {
    const isDirty =
      conclusionRecommendationList.length !== formData.length ||
      formData.some((item) => item.isEditable);

    if (isDirty) e.preventDefault();
  });

  return (
    <Fragment>
      {showAge && (
        <Tabs
          css={tabStyle}
          defaultActiveKey="FROM_5_LESS_THAN_12"
          items={itemFollowAges}
          onChange={(key) => handleAgeTypeChange(key)}
        />
      )}
      {showGender && (
        <Tabs
          css={tabStyle}
          defaultActiveKey="nam"
          items={items}
          onChange={(key) => setGender(key)}
        />
      )}

      <div
        style={{
          marginBottom: "1.4rem",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {creatable && (
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={handleAddEntry}
            css={addUnitBtnStyles}
          >
            Thêm kết luận và khuyến nghị
          </Button>
        )}

        {formData.some((item) => item.isEditable) && (
          <Row justify="end" css={footerButtonGroupStyles}>
            <Col>
              <Space>
                <Button shape="round" onClick={handleCancel} disabled={loading}>
                  Huỷ
                </Button>
                <Button
                  onClick={() => form.submit()}
                  type="primary"
                  shape="round"
                  disabled={loading}
                >
                  Lưu
                </Button>
              </Space>
            </Col>
          </Row>
        )}
      </div>
      <Spin spinning={loading}>
        <div css={contentAreaStyles}>
          {formData.length > 0 || conclusionRecommendationList.length > 0 ? (
            <Form
              css={formStyles}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              labelCol={{ span: 8 }}
              form={form}
            >
              {formData.map((unit, index) => (
                <div key={unit.id}>
                  <Row wrap={false} gutter={16}>
                    <Col flex={1} css={colStyles(unit.isEditable)}>
                      <BloodPressureDetails
                        unit={unit}
                        model={model}
                        selectedKey={selectedKey}
                        ageModel={ageModel}
                        typeOptions={typeOptions}
                        itemFollowAges={itemFollowAges}
                        operatorsOptions={operatorsOptions}
                      />
                    </Col>
                    <Col flex={1} css={hideDetailStyles(unit.isEditable)}>
                      {!excludeOptionAgeRelated(
                        selectedKey as ConclusionRecommendationKey
                      ) && (
                        <>
                          <Form.Item<FieldType>
                            name={`age[${unit.id}]`}
                            label="Tuổi"
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng chọn lứa tuổi!",
                              },
                            ]}
                          >
                            <Select
                              css={inputStyles}
                              allowClear
                              placeholder="Chọn Lứa tuổi"
                              optionFilterProp="label"
                              options={ageOptions}
                            />
                          </Form.Item>
                        </>
                      )}
                      {isIndicatorOne(
                        selectedKey as ConclusionRecommendationKey
                      ) && (
                        <>
                          <Form.Item<FieldType>
                            label={bloodPressureLabelOne.label}
                            name={`SBP[${unit.id}]`}
                            required
                          >
                            <Row gutter={10}>
                              <Col span={8}>
                                <Form.Item
                                  name={`SBPOperator[${unit.id}]`}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Vui lòng chọn Khoảng!",
                                    },
                                  ]}
                                  noStyle
                                >
                                  <Select
                                    allowClear
                                    optionFilterProp="label"
                                    placeholder="Chọn khoảng"
                                    options={operatorsOptions}
                                    onChange={(value) =>
                                      handleSbpOperator(unit.id, value)
                                    }
                                  />
                                </Form.Item>
                              </Col>
                              <Col
                                span={
                                  sbpOperatorValues[
                                    `SBPOperator[${unit.id}]`
                                  ] === "ABOUT"
                                    ? 16
                                    : 8
                                }
                              >
                                <Row align="middle" justify="center">
                                  <Col
                                    span={
                                      sbpOperatorValues[
                                        `SBPOperator[${unit.id}]`
                                      ] === "ABOUT"
                                        ? 11
                                        : 24
                                    }
                                  >
                                    <Form.Item
                                      name={`SBPStart[${unit.id}]`}
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Vui lòng nhập chỉ số bắt đầu!",
                                        },
                                      ]}
                                      noStyle
                                    >
                                      <InputNumber
                                        css={inputStyles}
                                        placeholder={
                                          sbpOperatorValues[
                                            `SBPOperator[${unit.id}]`
                                          ] === "ABOUT"
                                            ? "Từ"
                                            : ""
                                        }
                                        suffix={bloodPressureLabelOne.unit}
                                      />
                                    </Form.Item>
                                  </Col>
                                  {sbpOperatorValues[
                                    `SBPOperator[${unit.id}]`
                                  ] === "ABOUT" && (
                                    <>
                                      <Col span={2} css={dashColStyles}>
                                        -
                                      </Col>
                                      <Col span={11}>
                                        <Form.Item
                                          name={`SBPEnd[${unit.id}]`}
                                          rules={[
                                            {
                                              required: true,
                                              message:
                                                "Vui lòng nhập chỉ số kết thúc!",
                                            },
                                          ]}
                                          noStyle
                                        >
                                          <InputNumber
                                            css={inputStyles}
                                            placeholder="Đến"
                                            suffix={bloodPressureLabelOne.unit}
                                          />
                                        </Form.Item>
                                      </Col>
                                    </>
                                  )}
                                </Row>
                              </Col>
                            </Row>
                          </Form.Item>
                          {isIndicatorTwo(
                            selectedKey as ConclusionRecommendationKey
                          ) && (
                            <Row>
                              <Col span={8}></Col>
                              <Col>
                                <Form.Item<FieldType>
                                  name={`radioSelection[${unit.id}]`}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Vui lòng chọn!",
                                    },
                                  ]}
                                >
                                  <Radio.Group>
                                    <Radio value="and">Và</Radio>
                                    <Radio value="or">Và/ Hoặc</Radio>
                                  </Radio.Group>
                                </Form.Item>
                              </Col>
                            </Row>
                          )}
                        </>
                      )}
                      {isIndicatorTwo(
                        selectedKey as ConclusionRecommendationKey
                      ) && (
                        <>
                          <Form.Item<FieldType>
                            label={bloodPressureLabelTwo.label}
                            name={`DBP[${unit.id}]`}
                            required
                          >
                            <Row gutter={10}>
                              <Col span={8}>
                                <Form.Item
                                  name={`DBPOperator[${unit.id}]`}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Vui lòng chọn Khoảng!",
                                    },
                                  ]}
                                  noStyle
                                >
                                  <Select
                                    allowClear
                                    optionFilterProp="label"
                                    options={operatorsOptions}
                                    placeholder="Chọn khoảng"
                                    onChange={(value) =>
                                      handleDbpOperator(unit.id, value)
                                    }
                                  />
                                </Form.Item>
                              </Col>
                              <Col
                                span={
                                  dbpOperatorValues[
                                    `DBPOperator[${unit.id}]`
                                  ] === "ABOUT"
                                    ? 16
                                    : 8
                                }
                              >
                                <Row align="middle" justify="center">
                                  <Col
                                    span={
                                      dbpOperatorValues[
                                        `DBPOperator[${unit.id}]`
                                      ] === "ABOUT"
                                        ? 11
                                        : 24
                                    }
                                  >
                                    <Form.Item
                                      name={`DBPStart[${unit.id}]`}
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Vui lòng nhập chỉ số bắt đầu!",
                                        },
                                      ]}
                                      noStyle
                                    >
                                      <InputNumber
                                        css={inputStyles}
                                        placeholder={
                                          dbpOperatorValues[
                                            `DBPOperator[${unit.id}]`
                                          ] === "ABOUT"
                                            ? "Từ"
                                            : ""
                                        }
                                        suffix={bloodPressureLabelOne.unit}
                                      />
                                    </Form.Item>
                                  </Col>
                                  {dbpOperatorValues[
                                    `DBPOperator[${unit.id}]`
                                  ] === "ABOUT" && (
                                    <>
                                      <Col span={2} css={dashColStyles}>
                                        -
                                      </Col>
                                      <Col span={11}>
                                        <Form.Item
                                          name={`DBPEnd[${unit.id}]`}
                                          rules={[
                                            {
                                              required: true,
                                              message:
                                                "Vui lòng nhập chỉ số kết thúc!",
                                            },
                                          ]}
                                          noStyle
                                        >
                                          <InputNumber
                                            css={inputStyles}
                                            placeholder="Đến"
                                            suffix={bloodPressureLabelOne.unit}
                                          />
                                        </Form.Item>
                                      </Col>
                                    </>
                                  )}
                                </Row>
                              </Col>
                            </Row>
                          </Form.Item>
                        </>
                      )}
                      {!excludeOptionAgeRelated(
                        selectedKey as ConclusionRecommendationKey
                      ) && (
                        <>
                          <Form.Item<FieldType>
                            label="Phân loại"
                            name={`classification[${unit.id}]`}
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng chọn phân loại huyết áp!",
                              },
                            ]}
                          >
                            <Select
                              css={inputStyles}
                              allowClear
                              optionFilterProp="label"
                              placeholder="Chọn phân loại"
                              options={typeOptions}
                            />
                          </Form.Item>
                        </>
                      )}
                      {excludeOptionAgeRelated(
                        selectedKey as ConclusionRecommendationKey
                      ) && (
                        <>
                          {optionAgeType(
                            ageModel as ConclusionRecommendationAgeKey
                          ) && (
                            <>
                              <Form.Item<FieldType>
                                label={bloodPressureLabelOne.label}
                                name={`SBP[${unit.id}]`}
                                required
                              >
                                <Row gutter={10}>
                                  <Col span={8}>
                                    <Form.Item
                                      name={`SBPOperator[${unit.id}]`}
                                      rules={[
                                        {
                                          required: true,
                                          message: "Vui lòng chọn Khoảng!",
                                        },
                                      ]}
                                      noStyle
                                    >
                                      <Select
                                        allowClear
                                        optionFilterProp="label"
                                        placeholder="Chọn khoảng"
                                        options={operatorsOptions}
                                        onChange={(value) =>
                                          handleSbpOperator(unit.id, value)
                                        }
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col
                                    span={
                                      sbpOperatorValues[
                                        `SBPOperator[${unit.id}]`
                                      ] === "ABOUT"
                                        ? 16
                                        : 8
                                    }
                                  >
                                    <Row align="middle" justify="center">
                                      <Col
                                        span={
                                          sbpOperatorValues[
                                            `SBPOperator[${unit.id}]`
                                          ] === "ABOUT"
                                            ? 11
                                            : 24
                                        }
                                      >
                                        <Form.Item
                                          name={`SBPStart[${unit.id}]`}
                                          rules={[
                                            {
                                              required: true,
                                              message:
                                                "Vui lòng nhập chỉ số bắt đầu!",
                                            },
                                          ]}
                                          noStyle
                                        >
                                          <InputNumber
                                            css={inputStyles}
                                            placeholder={
                                              sbpOperatorValues[
                                                `SBPOperator[${unit.id}]`
                                              ] === "ABOUT"
                                                ? "Từ"
                                                : ""
                                            }
                                            suffix={bloodPressureLabelOne.unit}
                                          />
                                        </Form.Item>
                                      </Col>
                                      {sbpOperatorValues[
                                        `SBPOperator[${unit.id}]`
                                      ] === "ABOUT" && (
                                        <>
                                          <Col span={2} css={dashColStyles}>
                                            -
                                          </Col>
                                          <Col span={11}>
                                            <Form.Item
                                              name={`SBPEnd[${unit.id}]`}
                                              rules={[
                                                {
                                                  required: true,
                                                  message:
                                                    "Vui lòng nhập chỉ số kết thúc!",
                                                },
                                              ]}
                                              noStyle
                                            >
                                              <InputNumber
                                                css={inputStyles}
                                                placeholder="Đến"
                                                suffix={
                                                  bloodPressureLabelOne.unit
                                                }
                                              />
                                            </Form.Item>
                                          </Col>
                                        </>
                                      )}
                                    </Row>
                                  </Col>
                                </Row>
                              </Form.Item>
                            </>
                          )}
                          <Form.Item<FieldType>
                            label="Phân loại"
                            name={`classification[${unit.id}]`}
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng chọn phân loại huyết áp!",
                              },
                            ]}
                          >
                            <Select
                              css={inputStyles}
                              allowClear
                              optionFilterProp="label"
                              placeholder="Chọn phân loại"
                              options={typeOptions}
                            />
                          </Form.Item>
                        </>
                      )}
                      <Form.Item<FieldType>
                        label="Kết luận"
                        name={`conclusion[${unit.id}]`}
                        rules={
                          selectedKey === ConclusionRecommendationKey.BMI
                            ? [
                                {
                                  required: true,
                                  message: "Vui lòng nhập Kết luận!",
                                  transform: (value) =>
                                    value.replace(/<(.|\n)*?>/g, "").trim(),
                                  validateTrigger: "onBlur",
                                },
                              ]
                            : []
                        }
                      >
                        <ReactQuill
                          value={unit.conclusion}
                          modules={modules}
                          formats={formats}
                        />
                      </Form.Item>
                      <Form.Item<FieldType>
                        label="Khuyến nghị"
                        name={`recommendation[${unit.id}]`}
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập Khuyến nghị!",
                            transform: (value) =>
                              value.replace(/<(.|\n)*?>/g, "").trim(),
                            validateTrigger: "onBlur",
                          },
                        ]}
                      >
                        <ReactQuill
                          value={unit.recommendation}
                          modules={modules}
                          formats={formats}
                        />
                      </Form.Item>
                    </Col>

                    <Col>
                      <Space>
                        {!unit.isEditable && unit.id && updatable && (
                          <Tooltip title="Cập nhật">
                            <ButtonAnt
                              icon={<EditOutlined />}
                              type="primary"
                              onClick={() => handleEdit(unit.id)}
                            />
                          </Tooltip>
                        )}
                        {deletable && (
                          <Tooltip title="Xoá">
                            <ButtonAnt
                              icon={<DeleteOutlined />}
                              type="primary"
                              danger
                              onClick={() => handleDelete(unit.id)}
                            />
                          </Tooltip>
                        )}
                        {!(!unit.isEditable && unit.id) && (
                          <span css={unitPlaceholderStyles} />
                        )}
                      </Space>
                    </Col>
                  </Row>

                  {index < formData.length - 1 && (
                    <Divider css={dividerStyles} />
                  )}
                </div>
              ))}
            </Form>
          ) : (
            <Empty
              description="Chưa có kết luận và khuyến nghị nào"
              css={emptyStyles}
            />
          )}
        </div>
      </Spin>
    </Fragment>
  );
};

type BloodPressureDetailsProps = {
  unit: FormData;
  model: string;
  ageModel: string;
  selectedKey: string;
  typeOptions: any[];
  itemFollowAges: any[];
  operatorsOptions: any[];
};
const BloodPressureDetails = ({
  unit,
  model,
  selectedKey,
  ageModel,
  typeOptions,
  itemFollowAges,
  operatorsOptions,
}: BloodPressureDetailsProps) => {
  const bloodPressureLabelOne = useMemo(
    () => valueSelectedModelOne(selectedKey as ConclusionRecommendationKey),
    [selectedKey]
  );
  const bloodPressureLabelTwo = useMemo(
    () => valueSelectedModelTwo(selectedKey as ConclusionRecommendationKey),
    [selectedKey]
  );
  return (
    <>
      {!notShowAge(selectedKey as ConclusionRecommendationKey) && (
        <Row gutter={16}>
          <Col span={7}>Tuổi: </Col>
          {model === "WEIGHT" ? (
            <Col>{"<5 tuổi"}</Col>
          ) : (
            <Col>
              {itemFollowAges.find((item) => item.key === unit.age)?.label}
            </Col>
          )}
        </Row>
      )}

      {isIndicatorOne(selectedKey as ConclusionRecommendationKey) && (
        <>
          <Row gutter={16}>
            <Col span={7}>{bloodPressureLabelOne.label}: </Col>
            <Col>
              {operatorsOptions.find((item) => item.value === unit.SBPOperator)
                ?.label +
                (unit.SBPOperator === "ABOUT"
                  ? ` ${unit.SBPStart} đến ${unit.SBPEnd}`
                  : ` ${unit.SBPStart}`)}
              &nbsp;{bloodPressureLabelOne.unit}
            </Col>
          </Row>
        </>
      )}
      {excludeOptionAgeRelated(selectedKey as ConclusionRecommendationKey) && (
        <>
          {optionAgeType(ageModel as ConclusionRecommendationAgeKey) && (
            <>
              <Row gutter={16}>
                <Col span={7}>{bloodPressureLabelOne.label}: </Col>
                <Col>
                  {operatorsOptions.find(
                    (item) => item.value === unit.SBPOperator
                  )?.label +
                    (unit.SBPOperator === "ABOUT"
                      ? ` ${unit.SBPStart} đến ${unit.SBPEnd}`
                      : ` ${unit.SBPStart}`)}
                  &nbsp;{bloodPressureLabelOne.unit}
                </Col>
              </Row>
            </>
          )}
        </>
      )}

      {bloodPressureInput(selectedKey as ConclusionRecommendationKey) && (
        <>
          <Row gutter={16}>
            <Col span={7}></Col>
            <Col>
              <Radio.Group value={unit.radioSelection}>
                <Radio value="and">Và</Radio>
                <Radio value="or">Và/ Hoặc</Radio>
              </Radio.Group>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={7}>{bloodPressureLabelTwo.label}: </Col>
            <Col>
              {operatorsOptions.find((item) => item.value === unit.DBPOperator)
                ?.label +
                (unit.DBPOperator === "ABOUT"
                  ? ` ${unit.DBPStart} đến ${unit.DBPEnd}`
                  : ` ${unit.DBPStart}`)}
              &nbsp;{bloodPressureLabelTwo.unit}
            </Col>
          </Row>
        </>
      )}
      <Row gutter={16}>
        <Col span={7}>Phân loại: </Col>
        <Col>
          {
            typeOptions.find((item) => item.value === unit.classification)
              ?.label
          }
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={7}>Kết luận: </Col>
        <Col
          dangerouslySetInnerHTML={{
            __html: unit.conclusion || "",
          }}
        />
      </Row>
      <Row wrap={false} gutter={16}>
        <Col span={7}>Khuyến nghị: </Col>
        <Col
          dangerouslySetInnerHTML={{
            __html: unit.recommendation || "",
          }}
        />
      </Row>
    </>
  );
};

const contentAreaStyles = css`
  margin-left: 1.4rem;
  background: var(--white-color);
  padding: 2rem;
  border-radius: 0.6rem;
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  overflow-y: auto;
  margin-bottom: 2rem;
`;

const formStyles = css`
  max-width: 100rem;
  .ant-form-item-label {
    text-align: start;
  }
`;

const addUnitBtnStyles = css`
  margin-left: 1.4rem;
`;

const dividerStyles = css`
  margin: 0.6rem 0 3rem 0;
`;

const footerButtonGroupStyles = css`
  display: inline-block;
  margin-right: 1.4rem;
  button {
    width: 8rem;
  }
`;

const unitPlaceholderStyles = css`
  display: inline-block;
  width: 3.2rem;
`;

const inputStyles = css`
  width: 100%;
`;

const dashColStyles = css`
  text-align: center;
`;

const colStyles = (isEditable: boolean) => css`
  margin-bottom: 1.6rem;
  flex-direction: column;
  gap: 1rem;
  display: ${!isEditable ? "flex" : "none"};
`;

const hideDetailStyles = (hide: boolean) => css`
  display: ${hide ? "block" : "none"};
`;

const tabStyle = css`
  margin-left: 1.4rem;
  border-radius: 0.6rem;
  background: var(--white-color);
  padding: 0 1.4rem;
  margin-bottom: 1.4rem;
  .ant-tabs-nav {
    margin-bottom: 0;
  }
`;

const emptyStyles = css`
  min-height: calc(100vh - 44rem);
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;
